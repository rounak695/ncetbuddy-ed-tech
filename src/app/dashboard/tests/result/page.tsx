"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getTestById } from "@/lib/appwrite-db";
import { Test } from "@/types";

function TestResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const score = parseInt(searchParams.get("score") || "0");
    const total = parseInt(searchParams.get("total") || "0");
    const testId = searchParams.get("testId");

    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestDetails = async () => {
            if (testId) {
                const data = await getTestById(testId);
                setTest(data);
            }
            setLoading(false);
        };
        fetchTestDetails();
    }, [testId]);

    const percentage = Math.round((score / total) * 100) || 0;

    let grade = "C";
    let color = "text-yellow-500";
    if (percentage >= 90) { grade = "A+"; color = "text-green-500"; }
    else if (percentage >= 80) { grade = "A"; color = "text-green-400"; }
    else if (percentage >= 70) { grade = "B"; color = "text-blue-400"; }
    else if (percentage >= 60) { grade = "C"; color = "text-yellow-500"; }
    else if (percentage >= 40) { grade = "D"; color = "text-orange-500"; }
    else { grade = "F"; color = "text-red-500"; }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Test Results</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Score Card */}
                <Card className="flex flex-col items-center justify-center p-8 bg-neutral-900 border-white/10">
                    <span className="text-gray-400 text-sm mb-2">Total Score</span>
                    <div className="text-5xl font-bold text-white mb-2">
                        {score}<span className="text-2xl text-gray-500">/{total}</span>
                    </div>
                    <span className={`text-xl font-bold ${color}`}>{grade} Grade</span>
                </Card>

                {/* Accuracy Card */}
                <Card className="flex flex-col items-center justify-center p-8 bg-neutral-900 border-white/10">
                    <span className="text-gray-400 text-sm mb-2">Accuracy</span>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-neutral-800"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={351.86}
                                strokeDashoffset={351.86 - (351.86 * percentage) / 100}
                                className={percentage >= 50 ? "text-green-500" : "text-red-500"}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-2xl font-bold text-white">{percentage}%</span>
                    </div>
                </Card>

                {/* Time Card (Placeholder for now) */}
                <Card className="flex flex-col items-center justify-center p-8 bg-neutral-900 border-white/10">
                    <span className="text-gray-400 text-sm mb-2">Analysis</span>
                    <div className="w-full space-y-3 mt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-green-400">Correct</span>
                            <span className="font-bold">{score}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-red-400">Incorrect/Skipped</span>
                            <span className="font-bold">{total - score}</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2 mt-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex justify-center gap-4">
                <Link href="/dashboard/tests">
                    <Button variant="outline" className="border-white/20 hover:bg-neutral-800">
                        Take Another Test
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Button>
                        Back to Dashboard
                    </Button>
                </Link>
            </div>

            {test && (
                <div className="mt-8 text-center text-gray-500 text-sm">
                    Result for: <span className="text-gray-300">{test.title}</span>
                </div>
            )}
        </div>
    );
}

export default function TestResultPage() {
    return (
        <Suspense fallback={<div className="text-white p-4">Loading result...</div>}>
            <TestResultContent />
        </Suspense>
    );
}
