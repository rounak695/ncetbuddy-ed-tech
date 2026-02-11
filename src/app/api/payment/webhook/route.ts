import { NextRequest, NextResponse } from "next/server";
import { databases, DB_ID } from "@/lib/server/appwrite-admin";
import { Query } from "node-appwrite";
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get("content-type") || "";

        // Instamojo sends data as application/x-www-form-urlencoded
        if (!contentType.includes("application/x-www-form-urlencoded")) {
            return NextResponse.json({ error: "Invalid content-type" }, { status: 400 });
        }

        const formData = await request.formData();
        const data: Record<string, string> = {};

        // Convert FormData to object for MAC calculation
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        const salt = process.env.INSTAMOJO_SALT;
        const macProvided = data.mac;

        if (!salt) {
            console.error("INSTAMOJO_SALT not defined in environment variables");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // 1. Verify MAC (Message Authentication Code)
        // Sort keys alphabetically
        const keys = Object.keys(data).filter(k => k !== 'mac').sort();
        const message = keys.map(k => `${data[k]}`).join('|');

        const generatedMac = crypto.createHmac('sha1', salt)
            .update(message)
            .digest('hex');

        if (generatedMac !== macProvided) {
            console.error("Invalid MAC address - potential tampering");
            return NextResponse.json({ error: "Invalid MAC" }, { status: 400 });
        }

        // 2. Process Payment Status
        const paymentId = data.payment_id;
        const paymentRequestId = data.payment_request_id;
        const status = data.status; // 'Credit'

        console.log(`Webhook Received: Payment ${paymentId} for Request ${paymentRequestId} is ${status}`);

        // 3. Find Purchase Record
        const dbResponse = await databases.listDocuments(DB_ID, 'purchases', [
            Query.equal('paymentRequestId', paymentRequestId),
            Query.limit(1)
        ]);

        if (dbResponse.documents.length === 0) {
            console.error(`Purchase not found for payment request: ${paymentRequestId}`);
            return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
        }

        const purchase = dbResponse.documents[0];

        // 4. Update Database
        if (status === 'Credit') {
            // Only update if not already completed to avoid redundant writes
            if (purchase.status !== 'completed') {
                await databases.updateDocument(DB_ID, 'purchases', purchase.$id, {
                    status: 'completed',
                    paymentId: paymentId
                });
            }
        } else {
            if (purchase.status !== 'failed') {
                await databases.updateDocument(DB_ID, 'purchases', purchase.$id, {
                    status: 'failed',
                    paymentId: paymentId
                });
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
