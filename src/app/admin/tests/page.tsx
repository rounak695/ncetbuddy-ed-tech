"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTests, deleteTest } from "@/lib/appwrite-db";
import { Test } from "@/types";

export default function AdminTestsPage() {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const data = await getTests();
            setTests(data);
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this test?")) return;

        try {
            await deleteTest(id);
            setTests(tests.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting test:", error);
            alert("Failed to delete test");
        }
    };

    if (loading) return <div style={{ color: "white", padding: "2rem" }}>Loading tests...</div>;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>Manage Tests</h1>
                <Link href="/admin/tests/create">
                    <Button>Create New Test</Button>
                </Link>
            </div>

            <div style={{ display: "grid", gap: "1.5rem" }}>
                {tests.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)" }}>No tests found. Create one to get started.</p>
                ) : (
                    tests.map((test) => (
                        <Card key={test.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{test.title}</h3>
                                <p style={{ color: "var(--text-secondary)" }}>
                                    {test.duration} mins • {test.questions.length} Questions • {test.status}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <Button variant="outline">Edit</Button>
                                <Button variant="secondary" style={{ backgroundColor: "var(--error)" }} onClick={() => test.id && handleDelete(test.id)}>Delete</Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
