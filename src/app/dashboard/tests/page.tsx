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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mock Tests</h1>
                    <p className="text-gray-400 mt-1">Practice with real exam-like questions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                    <Card key={test.id} className="group hover:border-blue-500/50 transition-all duration-300">
                        <div className="flex flex-col h-full">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full">
                                        Mock Test
                                    </span>
                                    <span className="text-gray-400 text-sm flex items-center gap-1">
                                        ⏱️ {test.duration} min
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {test.title}
                                </h3>

                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                    {test.description || "Test your knowledge with this comprehensive mock test designed to help you prepare effectively."}
                                </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="text-sm text-gray-400">
                                    <span className="font-semibold text-white">{test.questions.length}</span> Questions
                                </div>
                                <Link href={`/dashboard/tests/attempt?id=${test.id}`}>
                                    <Button className="bg-white text-black hover:bg-gray-200">
                                        Start Test
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {tests.length === 0 && (
                <div className="text-center py-12 bg-neutral-900/50 rounded-2xl border border-white/10">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Tests Available</h3>
                    <p className="text-gray-400">Check back later for new mock tests.</p>
                </div>
            )}
        </div>
    );
}
