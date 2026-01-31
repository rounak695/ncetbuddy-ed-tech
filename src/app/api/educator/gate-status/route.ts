import { NextRequest, NextResponse } from 'next/server';
import { verifyGateToken } from '@/lib/server/gate-token';

export async function GET(request: NextRequest) {
    try {
        // Get gate token from cookie
        const token = request.cookies.get('edu_gate')?.value;

        if (!token) {
            return NextResponse.json({ verified: false });
        }

        // Verify token
        const payload = verifyGateToken(token);

        if (!payload) {
            return NextResponse.json({ verified: false });
        }

        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            return NextResponse.json({ verified: false });
        }

        return NextResponse.json({ verified: true });

    } catch (err) {
        console.error('Gate status error:', err);
        return NextResponse.json({ verified: false });
    }
}
