"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, databases, isAppwriteConfigured } from "@/lib/appwrite";
import { useAuth } from "@/context/AuthContext";
import { ID, OAuthProvider } from "appwrite";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
    const [name, setName] = useState("");
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
                'http://localhost:3000/dashboard',
                'http://localhost:3000/signup'
            );
        } catch (err: any) {
            console.error("Google login failed:", err);
            setError("Failed to initialize Google login");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        if (!isAppwriteConfigured()) {
            setError("Appwrite is not configured. Please check your environment variables.");
            setLoading(false);
            return;
        }

        try {
            // 1. Create Account
            const userId = ID.unique();
            await account.create(userId, email, password, name);

            // 2. Create Session (Auto-login)
            await account.createEmailPasswordSession(email, password);

            // 3. Create User Document in Database
            const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';
            const collectionId = 'users';

            try {
                await databases.createDocument(
                    dbId,
                    collectionId,
                    userId, // Use same ID as Auth Account
                    {
                        userId: userId,
                        email: email,
                        displayName: name,
                        role: 'user',
                        createdAt: Math.floor(Date.now() / 1000)
                    }
                );
            } catch (dbError: any) {
                console.warn("Database document creation failed:", dbError);
                // Continue even if DB fails, as Auth is successful. 
                // In a production app, you might want to rollback or queue this.
            }

            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            if (err.code === 409) {
                setError("User with this email already exists. Try logging in.");
            } else {
                setError(err.message || "Signup failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
            <Card className="w-full max-w-md bg-neutral-900 border-white/10 p-8">
                <h1 className="text-2xl font-bold mb-2 text-center text-white">Create Account</h1>
                <p className="text-gray-400 mb-8 text-center">Join NCET Buddy today</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 border-none font-semibold h-12"
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
                        Sign up with Google
                    </Button>
                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative z-10 inline-block px-4 bg-neutral-900 text-xs text-gray-500 uppercase">Or continue with email</div>
                    </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <Input
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                        className="bg-neutral-800 border-white/10 text-white placeholder-gray-500 focus:border-blue-500"
                    />

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
                        placeholder="Create a password (min 8 chars)"
                        className="bg-neutral-800 border-white/10 text-white placeholder-gray-500 focus:border-blue-500"
                    />

                    <Button type="submit" isLoading={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 mt-2">
                        Sign Up
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Login</Link></p>
                </div>
            </Card>
        </div>
    );
}

