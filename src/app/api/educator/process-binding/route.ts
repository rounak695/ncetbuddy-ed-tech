import { NextRequest, NextResponse } from 'next/server';
import { databases, upsertUserProfile } from '@/lib/server/user-profile';
import { Client, Account } from 'node-appwrite';

export async function POST(request: NextRequest) {
    try {
        // Parse request body to get session info
        const body = await request.json();
        const { sessionId, codeId } = body;

        if (!sessionId || !codeId) {
            return NextResponse.json(
                { success: false, error: 'missing_session_info' },
                { status: 400 }
            );
        }

        // Step 1: Verify session ID matches database
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

        let codeDoc;
        try {
            codeDoc = await databases.getDocument(dbId, 'educator_codes', codeId);
        } catch (err) {
            console.error('Failed to fetch code:', err);
            return NextResponse.json({ success: false, error: 'code_not_found' }, { status: 404 });
        }

        // Verify session ID matches
        if (codeDoc.pendingSessionId !== sessionId) {
            console.error('Session ID mismatch');
            return NextResponse.json({ success: false, error: 'session_invalid' }, { status: 401 });
        }

        // Verify code is active
        if (!codeDoc.active) {
            return NextResponse.json({ success: false, error: 'code_inactive' }, { status: 403 });
        }

        // Step 2: Get user from Appwrite session
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

        // Step 3: Binding logic
        if (!codeDoc.boundUserId) {
            // First use - bind
            try {
                await databases.updateDocument(dbId, 'educator_codes', codeDoc.$id, {
                    boundUserId: currentUser.$id,
                    boundEmail: currentUser.email,
                    lastUsedAt: Math.floor(Date.now() / 1000),
                    pendingSessionId: null, // Clear pending session
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
            // Same user - update lastUsedAt and clear pending session
            try {
                await databases.updateDocument(dbId, 'educator_codes', codeDoc.$id, {
                    lastUsedAt: Math.floor(Date.now() / 1000),
                    pendingSessionId: null, // Clear pending session
                });
            } catch (err) {
                console.error('Failed to update lastUsedAt:', err);
            }
        }

        // Step 4: Upsert user profile
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

        // Step 5: Return success
        return NextResponse.json({ success: true });

    } catch (err) {
        console.error('Process binding error:', err);
        return NextResponse.json({ success: false, error: 'unknown' }, { status: 500 });
    }
}
