"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, isAppwriteConfigured } from "@/lib/appwrite";
import { useAuth } from "@/context/AuthContext";
import { OAuthProvider } from "appwrite";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, loading: authLoading, checkSession } = useAuth();

    useEffect(() => {
        if (!authLoading && user) {
            router.push("/dashboard");
        }
    }, [user, authLoading, router]);

    const handleGoogleLogin = () => {
        try {
            account.createOAuth2Session(
                OAuthProvider.Google,
                'http://localhost:3000/dashboard', // Success redirect
                'http://localhost:3000/login'      // Failure redirect
            );
        } catch (err: any) {
            console.error("Google login failed:", err);
            setError("Failed to initialize Google login");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!isAppwriteConfigured()) {
            setError("Appwrite is not configured. Please check your environment variables.");
            setLoading(false);
            return;
        }

        try {
            await account.createEmailPasswordSession(email, password);
            await checkSession(); // Force context update
        } catch (err: any) {
            // Appwrite throws an error if a session is already active. 
            // We should treat this as a success and refresh session.
            if (err.message?.includes("session is active") || err.code === 409) {
                await checkSession();
            } else {
                // 401 (Invalid Credentials) should fall through here
                setError(err.message || "Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md bg-card border-border p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] mb-4 bg-white">
                        <img src="/logo.png" alt="NCET Buddy" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-black text-black uppercase tracking-tighter italic">Welcome Back</h1>
                    <p className="text-black font-bold opacity-60 uppercase tracking-widest text-[10px] mt-1">Login to access your dashboard</p>
                </div>

                {error && <div className="text-error mb-4 text-sm text-center bg-error/10 p-3 rounded-xl border border-error/20">{error}</div>}

                <div className="mb-6">
                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 bg-background text-foreground hover:bg-black/5 border-border font-semibold h-12 rounded-xl"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Sign in with Google
                    </Button>
                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative z-10 inline-block px-4 bg-card text-xs text-secondary font-medium uppercase tracking-wider">Or continue with email</div>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        className="bg-background border-border text-foreground placeholder-gray-400 focus:ring-primary/20 focus:border-primary h-12 rounded-xl"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="bg-background border-border text-foreground placeholder-gray-400 focus:ring-primary/20 focus:border-primary h-12 rounded-xl"
                    />

                    <Button type="submit" isLoading={loading} className="w-full bg-primary hover:bg-primary-hover text-black font-bold h-12 rounded-xl shadow-lg shadow-primary/20">
                        Login
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-secondary space-y-3">
                    <p className="px-6 text-[11px] leading-relaxed">
                        By logging in, you agree to our <Link href="/terms" className="text-foreground hover:underline font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-foreground hover:underline font-bold">Privacy Policy</Link>.
                    </p>
                    <p>Don't have an account? <Link href="/signup" className="text-primary hover:underline font-bold">Sign up</Link></p>
                </div>
            </Card>
        </div>
    );
}
