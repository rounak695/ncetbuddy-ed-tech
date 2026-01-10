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
    const { user, loading: authLoading } = useAuth();

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
            router.push("/dashboard");
        } catch (err: any) {
            // Appwrite throws an error if a session is already active. 
            // We should treat this as a success and redirect.
            if (err.message?.includes("session is active") || err.code === 409) {
                router.push("/dashboard");
            } else {
                // 401 (Invalid Credentials) should fall through here
                setError(err.message || "Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
            <Card className="w-full max-w-md bg-neutral-900 border-white/10 p-8">
                <h1 className="text-2xl font-bold mb-2 text-center text-white">Welcome Back</h1>
                <p className="text-gray-400 mb-8 text-center">Login to access your dashboard</p>

                {error && <div className="text-red-500 mb-4 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

                <div className="mb-6">
                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 border-none font-semibold"
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
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative z-10 inline-block px-4 bg-neutral-900 text-xs text-gray-500 uppercase">Or continue with email</div>
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
                        className="bg-neutral-800 border-white/10 text-white placeholder-gray-500 focus:border-blue-500"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="bg-neutral-800 border-white/10 text-white placeholder-gray-500 focus:border-blue-500"
                    />

                    <Button type="submit" isLoading={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                        Login
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Don't have an account? <Link href="/signup" className="text-blue-400 hover:text-blue-300">Sign up</Link></p>
                </div>
            </Card>
        </div>
    );
}
