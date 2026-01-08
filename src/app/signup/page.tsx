"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, databases } from "@/lib/appwrite";
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

        try {
            // 1. Create Account
            const userId = ID.unique();
            await account.create(userId, email, password, name);

            // 2. Create Session (Auto-login)
            await account.createEmailPasswordSession(email, password);

            // 3. Create User Document in Database
            await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db',
                'users',
                userId, // Use same ID as Auth Account
                {
                    userId: userId,
                    email: email,
                    displayName: name,
                    role: 'user',
                    createdAt: Date.now()
                }
            );

            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <Card style={{ width: "100%", maxWidth: "400px" }}>
                <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", textAlign: "center" }}>Create Account</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", textAlign: "center" }}>Join NCET Buddy today</p>

                {error && <div style={{ color: "var(--error)", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}

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
                        Sign up with Google
                    </Button>
                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative z-10 inline-block px-4 bg-neutral-900 text-xs text-gray-500 uppercase">Or continue with email</div>
                    </div>
                </div>

                <form onSubmit={handleSignup}>
                    <div style={{ marginBottom: "1rem" }}>
                        <Input
                            label="Full Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Create a password"
                        />
                    </div>

                    <Button type="submit" isLoading={loading} style={{ width: "100%" }}>
                        Sign Up
                    </Button>
                </form>

                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <p>Already have an account? <Link href="/login" style={{ color: "var(--primary)" }}>Login</Link></p>
                </div>
            </Card>
        </div>
    );
}
