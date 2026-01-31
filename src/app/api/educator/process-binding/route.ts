import { NextRequest, NextResponse } from 'next/server';
import { verifyGateToken } from '@/lib/server/gate-token';
import { databases, upsertUserProfile } from '@/lib/server/user-profile';
import { Client, Account } from 'node-appwrite';

export async function POST(request: NextRequest) {
    try {
        // Step 1: Verify gate token from cookie
        const gateToken = request.cookies.get('edu_gate')?.value;

        if (!gateToken) {
            return NextResponse.json({ success: false, error: 'gate_expired' }, { status: 401 });
        }

        const gatePayload = verifyGateToken(gateToken);

        if (!gatePayload) {
            return NextResponse.json({ success: false, error: 'gate_invalid' }, { status: 401 });
        }

        // Step 2: Get user from client-side session
        // The request will have cookies from the client
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_EDUCATOR || '';

        // Find Appwrite session cookie
        let sessionValue: string | undefined;

        const expectedCookie = request.cookies.get(`a_session_${projectId}`);
        if (expectedCookie) {
            sessionValue = expectedCookie.value;
        } else {
            const allCookies = request.cookies.getAll();
            const sessionCookie = allCookies.find(cookie => cookie.name.startsWith('a_session_'));
            if (sessionCookie) {
                sessionValue = sessionCookie.value;
            }
        }

        if (!sessionValue) {
            console.error('No session cookie found');
            return NextResponse.json({ success: false, error: 'no_session' }, { status: 401 });
        }

        // Create server client with session
        const serverClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1')
            .setProject(projectId)
            .setSession(sessionValue);

        const serverAccount = new Account(serverClient);

        // Get current user
        let currentUser;
        try {
            currentUser = await serverAccount.get();
        } catch (err) {
            console.error('Failed to get user:', err);
            return NextResponse.json({ success: false, error: 'invalid_session' }, { status: 401 });
        }

        // Step 3: Fetch educator code
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

        let codeDoc;
        try {
            codeDoc = await databases.getDocument(dbId, 'educator_codes', gatePayload.codeDocId);
        } catch (err) {
            console.error('Failed to fetch code:', err);
            return NextResponse.json({ success: false, error: 'code_not_found' }, { status: 404 });
        }

        // Verify code is active
        if (!codeDoc.active) {
            return NextResponse.json({ success: false, error: 'code_inactive' }, { status: 403 });
        }

        // Step 4: Binding logic
        if (!codeDoc.boundUserId) {
            // First use - bind
            try {
                await databases.updateDocument(dbId, 'educator_codes', codeDoc.$id, {
                    boundUserId: currentUser.$id,
                    boundEmail: currentUser.email,
                    lastUsedAt: Math.floor(Date.now() / 1000),
                });
            } catch (err) {
                console.error('Failed to bind code:', err);
                return NextResponse.json({ success: false, error: 'binding_failed' }, { status: 500 });
            }
        } else if (codeDoc.boundUserId !== currentUser.$id) {
            // Code bound to different user - reject
            try {
                await serverAccount.deleteSession('current');
            } catch (err) {
                console.error('Failed to logout:', err);
            }
            return NextResponse.json({ success: false, error: 'code_already_bound' }, { status: 403 });
        } else {
            // Same user - update lastUsedAt
            try {
                await databases.updateDocument(dbId, 'educator_codes', codeDoc.$id, {
                    lastUsedAt: Math.floor(Date.now() / 1000),
                });
            } catch (err) {
                console.error('Failed to update lastUsedAt:', err);
            }
        }

        // Step 5: Upsert user profile
        try {
            await upsertUserProfile(currentUser.$id, {
                role: 'educator',
                educatorCodeId: codeDoc.$id,
                email: currentUser.email,
            });
        } catch (err) {
            console.error('Failed to upsert profile:', err);
            return NextResponse.json({ success: false, error: 'profile_failed' }, { status: 500 });
        }

        // Step 6: Clear gate token and return success
        const response = NextResponse.json({ success: true });
        response.cookies.delete('edu_gate');

        return response;

    } catch (err) {
        console.error('Process binding error:', err);
        return NextResponse.json({ success: false, error: 'unknown' }, { status: 500 });
    }
}
