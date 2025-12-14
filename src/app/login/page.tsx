"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { useAuth } from "@/context/AuthContext";
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await account.createEmailPasswordSession(email, password);
            router.push("/dashboard");
        } catch (err: any) {
            // If session already exists, redirect to dashboard
            if (err.message?.includes("session is active") || err.code === 401) {
                router.push("/dashboard");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <Card style={{ width: "100%", maxWidth: "400px" }}>
                <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", textAlign: "center" }}>Welcome Back</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", textAlign: "center" }}>Login to access your dashboard</p>

                {error && <div style={{ color: "var(--error)", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}

                <form onSubmit={handleLogin}>
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
                            placeholder="Enter your password"
                        />
                    </div>

                    <Button type="submit" isLoading={loading} style={{ width: "100%" }}>
                        Login
                    </Button>
                </form>

                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <p>Don't have an account? <Link href="/signup" style={{ color: "var(--primary)" }}>Sign up</Link></p>
                </div>
            </Card>
        </div>
    );
}
