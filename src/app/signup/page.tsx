"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account, databases } from "@/lib/appwrite";
import { useAuth } from "@/context/AuthContext";
import { ID } from "appwrite";
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
