"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Fixed credentials check
        const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "ncetbuddy@2024";

        if (credentials.username === adminUsername && credentials.password === adminPassword) {
            // Set a simple session token in localStorage
            localStorage.setItem("admin_authenticated", "true");
            localStorage.setItem("admin_login_time", Date.now().toString());
            router.push("/admin");
        } else {
            setError("Invalid username or password.");
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)"
        }}>
            <Card style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <Lock size={24} />
                        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Admin Login</h1>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        Enter your credentials to access the admin panel
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                        <Input
                            label="Username"
                            placeholder="Enter username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: "var(--error)",
                            fontSize: "0.9rem",
                            marginBottom: "1rem",
                            textAlign: "center"
                        }}>
                            {error}
                        </div>
                    )}

                    <Button type="submit" style={{ width: "100%" }} disabled={loading}>
                        {loading ? "Logging in..." : "Login to Admin Panel"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
