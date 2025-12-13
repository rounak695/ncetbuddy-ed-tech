"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTests, getBooks, getUsers } from "@/lib/appwrite-db";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        tests: 0,
        books: 0,
        activeUsers: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [tests, books, users] = await Promise.all([
                    getTests(),
                    getBooks(),
                    getUsers()
                ]);

                setStats({
                    users: users.length,
                    tests: tests.length,
                    books: books.length,
                    activeUsers: Math.floor(users.length * 0.4) // Mock active users as 40% of total
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: "2rem" }}>Admin Dashboard</h1>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
                <Card style={{ textAlign: "center", padding: "2rem" }}>
                    <h2 style={{ fontSize: "3rem", color: "var(--primary)", marginBottom: "0.5rem" }}>{stats.users}</h2>
                    <p style={{ color: "var(--text-secondary)" }}>Total Students</p>
                </Card>
                <Card style={{ textAlign: "center", padding: "2rem" }}>
                    <h2 style={{ fontSize: "3rem", color: "#4ade80", marginBottom: "0.5rem" }}>{stats.activeUsers}</h2>
                    <p style={{ color: "var(--text-secondary)" }}>Active Today</p>
                </Card>
                <Card style={{ textAlign: "center", padding: "2rem" }}>
                    <h2 style={{ fontSize: "3rem", color: "#60a5fa", marginBottom: "0.5rem" }}>{stats.tests}</h2>
                    <p style={{ color: "var(--text-secondary)" }}>Mock Tests</p>
                </Card>
                <Card style={{ textAlign: "center", padding: "2rem" }}>
                    <h2 style={{ fontSize: "3rem", color: "#f472b6", marginBottom: "0.5rem" }}>{stats.books}</h2>
                    <p style={{ color: "var(--text-secondary)" }}>Books & Notes</p>
                </Card>
            </div>

            {/* Quick Actions */}
            <h2 style={{ marginBottom: "1.5rem" }}>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                <Link href="/admin/books">
                    <Card style={{ cursor: "pointer", transition: "transform 0.2s", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                        <span style={{ fontSize: "2rem", marginBottom: "1rem" }}>📚</span>
                        <h3>Upload Notes</h3>
                    </Card>
                </Link>
                <Link href="/admin/tests/create">
                    <Card style={{ cursor: "pointer", transition: "transform 0.2s", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                        <span style={{ fontSize: "2rem", marginBottom: "1rem" }}>📝</span>
                        <h3>Create Test</h3>
                    </Card>
                </Link>
                <Link href="/admin/users">
                    <Card style={{ cursor: "pointer", transition: "transform 0.2s", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                        <span style={{ fontSize: "2rem", marginBottom: "1rem" }}>👥</span>
                        <h3>Manage Users</h3>
                    </Card>
                </Link>
                <Link href="/admin/notifications">
                    <Card style={{ cursor: "pointer", transition: "transform 0.2s", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                        <span style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔔</span>
                        <h3>Send Notification</h3>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
