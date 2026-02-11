"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTests, getBooks, getUsers, getUserPurchases } from "@/lib/appwrite-db";
import { databases, DB_ID } from "@/lib/server/appwrite-admin";
import { Purchase } from "@/types";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        tests: 0,
        books: 0,
        activeUsers: 0,
        totalRevenue: 0,
        totalTransactions: 0
    });
    const [recentPurchases, setRecentPurchases] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [tests, books, users] = await Promise.all([
                    getTests(),
                    getBooks(),
                    getUsers()
                ]);

                // Fetch all purchases for analytics (client-side can't query all, so we make API call)
                const purchasesResponse = await fetch('/api/admin/purchases');
                const purchases = purchasesResponse.ok ? await purchasesResponse.json() : [];

                const completedPurchases = purchases.filter((p: any) => p.status === 'completed');
                const totalRevenue = completedPurchases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

                setStats({
                    users: users.length,
                    tests: tests.length,
                    books: books.length,
                    activeUsers: Math.floor(users.length * 0.4), // Mock active users as 40% of total
                    totalRevenue: totalRevenue,
                    totalTransactions: completedPurchases.length
                });

                // Get recent 5 purchases
                setRecentPurchases(purchases.slice(0, 5));
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
                <Card style={{ textAlign: "center", padding: "2rem" }}>
                    <h2 style={{ fontSize: "3rem", color: "#fbbf24", marginBottom: "0.5rem" }}>₹{stats.totalRevenue}</h2>
                    <p style={{ color: "var(--text-secondary)" }}>Total Revenue</p>
                </Card>
                <Card style={{ textAlign: "center", padding: "2rem" }}>
                    <h2 style={{ fontSize: "3rem", color: "#10b981", marginBottom: "0.5rem" }}>{stats.totalTransactions}</h2>
                    <p style={{ color: "var(--text-secondary)" }}>Paid Transactions</p>
                </Card>
            </div>

            {/* Recent Transactions */}
            {recentPurchases.length > 0 && (
                <div style={{ marginBottom: "3rem" }}>
                    <h2 style={{ marginBottom: "1.5rem" }}>Recent Transactions</h2>
                    <Card>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th style={{ padding: "1rem", textAlign: "left" }}>Date</th>
                                    <th style={{ padding: "1rem", textAlign: "left" }}>Test ID</th>
                                    <th style={{ padding: "1rem", textAlign: "left" }}>Amount</th>
                                    <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPurchases.map((purchase, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                                        <td style={{ padding: "1rem" }}>
                                            {new Date(purchase.createdAt * 1000).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: "1rem", fontFamily: "monospace", fontSize: "0.9rem" }}>
                                            {purchase.testId.substring(0, 8)}...
                                        </td>
                                        <td style={{ padding: "1rem", fontWeight: "bold" }}>
                                            ₹{purchase.amount}
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            <span style={{
                                                padding: "0.25rem 0.75rem",
                                                borderRadius: "12px",
                                                fontSize: "0.85rem",
                                                backgroundColor: purchase.status === 'completed' ? '#10b981' : purchase.status === 'pending' ? '#fbbf24' : '#ef4444',
                                                color: 'white'
                                            }}>
                                                {purchase.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            )}

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
