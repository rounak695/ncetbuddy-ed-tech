import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/server/user-profile';
import { hashCode } from '@/lib/server/hash-code';
import { generateGateToken } from '@/lib/server/gate-token';
import { Query } from 'node-appwrite';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const limit = rateLimitMap.get(ip);

    if (!limit || now > limit.resetTime) {
        // Reset or first attempt
        rateLimitMap.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 }); // 5 minutes
        return true;
    }

    if (limit.count >= 5) {
        return false; // Rate limit exceeded
    }

    limit.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

        // Check rate limit
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { ok: false, message: 'Too many attempts. Please try again later.' },
                { status: 429 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { clientCode } = body;

        if (!clientCode || typeof clientCode !== 'string') {
            return NextResponse.json(
                { ok: false, message: 'Client code is required' },
                { status: 400 }
            );
        }

        // Hash the code
        const codeHash = hashCode(clientCode);

        // Query database for matching code
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

        const response = await databases.listDocuments(dbId, 'educator_codes', [
            Query.equal('codeHash', codeHash),
            Query.equal('active', true),
        ]);

        if (response.documents.length === 0) {
            return NextResponse.json(
                { ok: false, message: 'Invalid or inactive code' },
                { status: 401 }
            );
        }

        const codeDoc = response.documents[0];

        // Generate gate token
        const token = generateGateToken(codeDoc.$id);

        // Set HttpOnly cookie
        const cookieResponse = NextResponse.json({ ok: true });

        cookieResponse.cookies.set('edu_gate', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 60, // 30 minutes (increased for OAuth flow)
        });

        return cookieResponse;

    } catch (err) {
        console.error('Verify code error:', err);
        return NextResponse.json(
            { ok: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
