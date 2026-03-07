import { NextResponse } from 'next/server';
import { databases, DB_ID } from '@/lib/server/appwrite-admin';
import { ID, Query } from 'node-appwrite';

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        // Check if user already has access
        const existingPayments = await databases.listDocuments(DB_ID, 'payments', [
            Query.equal('userId', userId),
            Query.equal('productName', "NCET Ready Test"),
            Query.equal('status', 'Credit')
        ]);

        if (existingPayments.documents.length > 0) {
            return NextResponse.json({ success: true, message: "User already has access." });
        }

        // Create manual payment record with Server API Key (bypassing permissions)
        const manualPaymentId = `manual_admin_unlock_${Date.now()}`;

        await databases.createDocument(
            DB_ID,
            'payments',
            ID.unique(),
            {
                userId,
                paymentId: manualPaymentId,
                paymentRequestId: manualPaymentId,
                amount: 0,
                status: 'Credit',
                productName: "NCET Ready Test",
                createdAt: Math.floor(Date.now() / 1000)
            }
        );

        return NextResponse.json({ success: true, message: "Test access granted successfully." });

    } catch (error: any) {
        console.error("API Error (Admin Grant Access):", error);
        return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
    }
}
