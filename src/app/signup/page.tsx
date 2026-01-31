"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite-student";
import { useAuth } from "@/context/AuthContext";
import { OAuthProvider } from "appwrite";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
    const [error, setError] = useState("");
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && user) {
            router.push("/dashboard");
        }
    }, [user, authLoading, router]);

    const handleGoogleSignup = () => {
        try {
            account.createOAuth2Session(
                OAuthProvider.Google,
                `${window.location.origin}/dashboard`,
                `${window.location.origin}/signup`
            );
        } catch (err: any) {
            console.error("Google signup failed:", err);
            setError("Failed to initialize Google signup");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md bg-card border-border p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] mb-4 bg-white">
                        <img src="/logo.png" alt="NCET Buddy" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-black text-black uppercase tracking-tighter italic">Get Started</h1>
                    <p className="text-black font-bold opacity-60 uppercase tracking-widest text-[10px] mt-1">Sign up with Google to begin</p>
                </div>

                {error && <div className="text-error mb-4 text-sm text-center bg-error/10 p-3 rounded-xl border border-error/20">{error}</div>}

                <Button
                    onClick={handleGoogleSignup}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300 font-semibold h-14 rounded-xl shadow-md hover:shadow-lg transition-all"
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
                    Sign up with Google
                </Button>

                <div className="mt-8 text-center text-sm text-secondary space-y-3">
                    <p className="px-6 text-[11px] leading-relaxed">
                        By signing up, you agree to our <Link href="/terms" className="text-foreground hover:underline font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-foreground hover:underline font-bold">Privacy Policy</Link>.
                    </p>
                    <p>Already have an account? <Link href="/login" className="text-primary hover:underline font-bold">Sign in</Link></p>
                </div>
            </Card>
        </div>
    );
}
