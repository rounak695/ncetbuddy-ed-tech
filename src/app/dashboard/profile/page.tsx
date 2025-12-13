"use client";

import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function ProfilePage() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate update
        setTimeout(() => {
            setLoading(false);
            alert("Profile updated!");
        }, 1000);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "2rem" }}>My Profile</h1>

            <Card>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "bold", color: "black" }}>
                        {user?.name?.[0] || "U"}
                    </div>
                    <div>
                        <h2 style={{ fontSize: "1.5rem" }}>{user?.name || "User"}</h2>
                        <p style={{ color: "var(--text-secondary)" }}>{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate}>
                    <Input
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button type="submit" isLoading={loading}>Save Changes</Button>
                </form>
            </Card>
        </div>
    );
}
