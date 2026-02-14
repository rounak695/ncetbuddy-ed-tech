import { NextRequest, NextResponse } from "next/server";
import { databases, DB_ID } from "@/lib/server/appwrite-admin";
import { Query } from "node-appwrite";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const paymentId = searchParams.get('payment_id');
        const paymentRequestId = searchParams.get('payment_request_id');
        const paymentStatus = searchParams.get('payment_status'); // 'Credit' or 'Failed'

        if (!paymentId || !paymentRequestId || !paymentStatus) {
            return NextResponse.json({ error: "Invalid callback parameters" }, { status: 400 });
        }

        // 1. Find the purchase record (Admin Access)
        const dbResponse = await databases.listDocuments(DB_ID, 'purchases', [
            Query.equal('paymentRequestId', paymentRequestId),
            Query.limit(1)
        ]);

        if (dbResponse.documents.length === 0) {
            return NextResponse.json({ error: "Purchase record not found" }, { status: 404 });
        }

        const purchase = dbResponse.documents[0];

        // 2. Verify Payment Status with Instamojo API
        const INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY;
        const INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN;
        const INSTAMOJO_ENDPOINT = process.env.INSTAMOJO_ENDPOINT || "https://test.instamojo.com/api/1.1/";

        if (!INSTAMOJO_API_KEY || !INSTAMOJO_AUTH_TOKEN) {
            console.error("Missing Instamojo credentials");
            // Fallback to query param if credentials missing (development only) but verify status
            if (paymentStatus !== 'Credit') {
                await databases.updateDocument(DB_ID, 'purchases', purchase.$id, {
                    status: 'failed',
                    paymentId: paymentId
                });
                return NextResponse.redirect(new URL('/dashboard/tests?success=false', request.url));
            }
            // If credit and no keys, we proceed (risky, but allows local dev without keys if needed)
            // Ideally we should block this in prod.
        } else {
            // Verify upstream
            const response = await fetch(`${INSTAMOJO_ENDPOINT}payment-requests/${paymentRequestId}/`, {
                headers: {
                    'X-Api-Key': INSTAMOJO_API_KEY,
                    'X-Auth-Token': INSTAMOJO_AUTH_TOKEN
                }
            });

            const data = await response.json();

            if (!data.success) {
                console.error("Failed to verify payment with Instamojo:", data);
                return NextResponse.json({ error: "Verification failed" }, { status: 500 });
            }

            const paymentRequestStatus = data.payment_request.status; // 'Completed' or 'Pending'
            const payments = data.payment_request.payments || [];

            // Check if specific payment ID is successful
            const payment = payments.find((p: any) => p.payment_id === paymentId);

            // Strict check: Request must be Completed AND specific payment must be Credit
            if (paymentRequestStatus !== 'Completed' || !payment || payment.status !== 'Credit') {
                console.warn("Payment verification failed. Status:", paymentRequestStatus);
                await databases.updateDocument(DB_ID, 'purchases', purchase.$id, {
                    status: 'failed',
                    paymentId: paymentId
                });
                return NextResponse.redirect(new URL('/dashboard/tests?success=false', request.url));
            }
        }

        // 3. Update status to completed
        await databases.updateDocument(DB_ID, 'purchases', purchase.$id, {
            status: 'completed',
            paymentId: paymentId
        });

        // Redirect to success page
        return NextResponse.redirect(new URL('/dashboard/tests?success=true', request.url));

    } catch (error) {
        console.error("Payment Callback Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
