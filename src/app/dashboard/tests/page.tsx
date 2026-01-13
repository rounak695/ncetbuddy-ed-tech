"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getTests } from "@/lib/appwrite-db";
import { isAppwriteConfigured } from "@/lib/appwrite";
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Mock Tests</h1>
                    <p className="text-foreground mt-1 font-medium">Practice with real exam-like questions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                    <Card key={test.id} className="group hover:border-primary/50 transition-all duration-300 shadow-lg">
                        <div className="flex flex-col h-full">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 text-xs font-bold text-black bg-primary rounded-full">
                                        Mock Test
                                    </span>
                                    <span className="text-foreground text-sm font-bold flex items-center gap-1">
                                        ⏱️ {test.duration} min
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {test.title}
                                </h3>

                                <p className="text-foreground text-sm mb-6 line-clamp-2 font-medium">
                                    {test.description || "Test your knowledge with this comprehensive mock test designed to help you prepare effectively."}
                                </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                                <div className="text-sm text-foreground font-bold">
                                    <span className="font-bold underline decoration-primary decoration-4">{test.questions.length}</span> Questions
                                </div>
                                <Link href={`/dashboard/tests/attempt?id=${test.id}`}>
                                    <Button className="bg-black text-white hover:bg-black/90 shadow-md">
                                        Start Test
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {tests.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-black">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                        {isAppwriteConfigured() ? "No Tests Available" : "Appwrite Not Configured"}
                    </h3>
                    <p className="text-foreground font-medium">
                        {isAppwriteConfigured()
                            ? "Check back later for new mock tests."
                            : "Please set up your .env.local file with NEXT_PUBLIC_APPWRITE_PROJECT_ID."}
                    </p>
                </div>
            )}
        </div>
    );
}
