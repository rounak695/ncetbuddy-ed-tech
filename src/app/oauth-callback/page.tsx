"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import pb from "@/lib/pocketbase";

function OAuthCallbackContent() {
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const completeAuth = async () => {
            try {
                const code = searchParams.get("code");
                const state = searchParams.get("state");
                
                if (!code) {
                    setError("No authorization code received from Google.");
                    return;
                }

                // Retrieve the stored provider data
                const providerStr = localStorage.getItem("pb_oauth_provider");
                if (!providerStr) {
                    setError("OAuth session expired. Please try logging in again.");
                    return;
                }

                const provider = JSON.parse(providerStr);
                
                // Verify state matches to prevent CSRF
                if (state !== provider.state) {
                    setError("OAuth state mismatch. Please try logging in again.");
                    return;
                }

                const redirectUrl = `${window.location.origin}/oauth-callback`;

                // Complete the OAuth flow with PocketBase
                const authData = await pb.collection("users").authWithOAuth2Code(
                    provider.name,
                    code,
                    provider.codeVerifier,
                    redirectUrl
                );

                // Clean up localStorage
                localStorage.removeItem("pb_oauth_provider");
                const redirect = localStorage.getItem("pb_oauth_redirect") || "/dashboard";
                localStorage.removeItem("pb_oauth_redirect");

                // Redirect to dashboard
                router.push(redirect);
            } catch (err: any) {
                console.error("OAuth callback failed:", err);
                setError(err?.message || "Authentication failed. Please try again.");
                localStorage.removeItem("pb_oauth_provider");
                localStorage.removeItem("pb_oauth_redirect");
            }
        };

        completeAuth();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="text-center">
                {error ? (
                    <div className="space-y-4">
                        <div className="text-error text-lg font-bold">{error}</div>
                        <a
                            href="/login"
                            className="inline-block px-8 py-3 bg-primary text-black font-black uppercase tracking-widest rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
                        >
                            Back to Login
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-foreground font-bold uppercase tracking-widest text-sm">
                            Completing sign in...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <OAuthCallbackContent />
        </Suspense>
    );
}
