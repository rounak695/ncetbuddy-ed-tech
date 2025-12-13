"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getTests } from "@/lib/appwrite-db";
import { Test } from "@/types";

export default function TestsPage() {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const data = await getTests();
                // Filter only visible/published tests if needed
                setTests(data.filter(t => t.isVisible !== false));
            } catch (error) {
                console.error("Error fetching tests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    if (loading) return <div style={{ color: "white", padding: "2rem" }}>Loading tests...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: "2rem" }}>Available Mock Tests</h1>
            <div style={{ display: "grid", gap: "1.5rem" }}>
                {tests.map((test) => (
                    <Card key={test.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{test.title}</h3>
                            <p style={{ color: "var(--text-secondary)" }}>
                                {test.duration} mins • {test.questions.length} Questions
                            </p>
                        </div>
                        <Link href={`/dashboard/tests/attempt?id=${test.id}`}>
                            <Button>Start Test</Button>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    );
}
