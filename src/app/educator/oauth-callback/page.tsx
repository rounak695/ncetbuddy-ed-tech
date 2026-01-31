"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite-educator';

export default function EducatorOAuthCallbackPage() {
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function processCallback() {
            try {
                // Get session info from localStorage
                const sessionId = localStorage.getItem('edu_session_id');
                const codeId = localStorage.getItem('edu_code_id');

                if (!sessionId || !codeId) {
                    setErrorMessage('session_missing');
                    setStatus('error');
                    setTimeout(() => router.push('/educator/login?error=session_missing'), 2000);
                    return;
                }

                // Wait for Appwrite session to be ready (OAuth takes time)
                let currentUser;
                let retries = 0;
                const maxRetries = 10; // Try for ~15 seconds total

                while (retries < maxRetries) {
                    try {
                        currentUser = await account.get();
                        // Success - session is ready!
                        break;
                    } catch (err) {
                        // Session not ready yet, wait and retry
                        retries++;
                        if (retries >= maxRetries) {
                            console.error('Failed to get session after retries:', err);
                            setErrorMessage('no_session');
                            setStatus('error');
                            setTimeout(() => router.push('/educator/login?error=no_session'), 2000);
                            return;
                        }
                        // Exponential backoff: 200ms, 400ms, 800ms, 1600ms, etc.
                        await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, retries - 1)));
                    }
                }

                if (!currentUser) {
                    setErrorMessage('no_session');
                    setStatus('error');
                    setTimeout(() => router.push('/educator/login?error=no_session'), 2000);
                    return;
                }

                // Call our API endpoint to process the binding
                const response = await fetch('/api/educator/process-binding', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Important: send cookies
                    body: JSON.stringify({ sessionId, codeId }),
                });

                const data = await response.json();

                if (data.success) {
                    // Clear localStorage
                    localStorage.removeItem('edu_session_id');
                    localStorage.removeItem('edu_code_id');

                    setStatus('success');
                    // Redirect to dashboard
                    setTimeout(() => router.push('/educator/dashboard'), 1000);
                } else {
                    setErrorMessage(data.error || 'unknown');
                    setStatus('error');
                    setTimeout(() => router.push(`/educator/login?error=${data.error || 'unknown'}`), 2000);
                }

            } catch (err) {
                console.error('Callback processing error:', err);
                setErrorMessage('unknown');
                setStatus('error');
                setTimeout(() => router.push('/educator/login?error=unknown'), 2000);
            }
        }

        processCallback();
    }, [router]);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                {status === 'processing' && (
                    <>
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                        <h2 className="text-2xl font-bold text-black mb-2">Setting up your account...</h2>
                        <p className="text-foreground/60">Please wait while we verify your credentials.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-2">Success!</h2>
                        <p className="text-foreground/60">Redirecting to your dashboard...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-2">Authentication Failed</h2>
                        <p className="text-foreground/60">Redirecting back to login...</p>
                    </>
                )}
            </div>
        </div>
    );
}
