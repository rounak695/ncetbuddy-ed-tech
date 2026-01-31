"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite-educator";
import { OAuthProvider } from "appwrite";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function EducatorLoginPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleGoogleLogin = async () => {
        try {
            // Force logout if a stale session exists to prevent 401
            await account.deleteSession("current").catch(() => { });

            account.createOAuth2Session(
                OAuthProvider.Google,
                `${window.location.origin}/educator/dashboard`,
                `${window.location.origin}/educator/login`
            );
        } catch (err) {
            console.error(err);
            setError("Failed to initialize Google login");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 lg:p-12">
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-start">

                {/* Left Column: Marketing Story */}
                <div className="flex flex-col gap-8 text-black pb-12 pt-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9]">
                            Launch your branded exam portal in <span className="bg-primary px-1">days</span> — not weeks.
                        </h1>
                        <h2 className="text-xl md:text-2xl font-bold opacity-70">
                            You teach. You grow. We run the exam tech behind the scenes.
                        </h2>
                    </div>

                    <div className="space-y-6 text-lg font-medium opacity-80 leading-relaxed max-w-2xl">
                        <p>
                            You have the students and the content, but building a secure testing platform is complex.
                            We solve that. Our infrastructure handles <span className="font-bold text-black border-b-2 border-primary">heavy traffic spikes</span>,
                            ensures 99.9% uptime, and provides bank-grade security.
                        </p>
                    </div>
                </div>

                {/* Right Column: Login Form */}
                <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-black flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-3xl font-black uppercase tracking-tight text-black">Educator Login</h3>
                        <p className="text-lg font-medium text-foreground opacity-70">Sign in with Google to continue</p>
                    </div>

                    {error && <div className="text-error text-sm bg-error/10 p-3 rounded-xl border border-error/20">{error}</div>}

                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="h-16 flex items-center justify-center gap-3 bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300 font-semibold text-base rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <p className="text-foreground/60 text-sm text-center mt-2">
                        Don't have an account? <Link href="/educator/signup" className="text-primary hover:underline font-bold">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
