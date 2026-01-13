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
    const correct = parseInt(searchParams.get("correct") || "0");
    const incorrect = parseInt(searchParams.get("incorrect") || "0");
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

    const maxScore = total * 4;
    const percentage = Math.round((correct / total) * 100) || 0;

    let grade = "C";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 40) grade = "D";
    else grade = "F";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="text-center">
                <h1 className="text-5xl font-black text-black mb-2 uppercase italic tracking-tighter">Performance Analysis</h1>
                <p className="text-black font-bold opacity-60 uppercase tracking-widest text-xs">Summary of your mock test attempt</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Score Card */}
                <Card className="flex flex-col items-center justify-center p-10 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                    <span className="text-black text-xs font-black mb-4 uppercase tracking-widest opacity-50">Score Obtained</span>
                    <div className="text-6xl font-black text-black mb-4">
                        {score}<span className="text-2xl opacity-30">/{maxScore}</span>
                    </div>
                    <span className={`px-6 py-2 rounded-full font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary text-black`}>{grade} Grade</span>
                </Card>

                {/* Accuracy Card */}
                <Card className="flex flex-col items-center justify-center p-10 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,208,47,1)] rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
                    <span className="text-black text-xs font-black mb-6 uppercase tracking-widest opacity-50">Accuracy</span>
                    <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="72"
                                cy="72"
                                r="64"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-black/5"
                            />
                            <circle
                                cx="72"
                                cy="72"
                                r="64"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={402.12}
                                strokeDashoffset={402.12 - (402.12 * percentage) / 100}
                                className={percentage >= 50 ? "text-primary" : "text-black"}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-4xl font-black text-black">{percentage}%</span>
                    </div>
                </Card>

                {/* Analysis Card */}
                <Card className="flex flex-col items-center justify-center p-10 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                    <span className="text-black text-xs font-black mb-6 uppercase tracking-widest opacity-50">Question Breakdown</span>
                    <div className="w-full space-y-6">
                        <div className="flex justify-between items-end">
                            <span className="text-black font-black uppercase tracking-tighter text-sm">Correct</span>
                            <span className="text-2xl font-black text-green-500">+{correct}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-black font-black uppercase tracking-tighter text-sm">Mistakes</span>
                            <span className="text-2xl font-black text-red-500">-{incorrect}</span>
                        </div>
                        <div className="w-full bg-black/5 rounded-full h-4 border-2 border-black p-0.5">
                            <div
                                className="bg-primary h-full rounded-full border border-black"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
                <Link href="/dashboard/tests" className="w-full sm:w-auto">
                    <Button className="w-full bg-white border-4 border-black text-black hover:bg-black hover:text-white font-black py-6 px-10 h-auto text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                        TRY ANOTHER TEST
                    </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button className="w-full bg-primary border-4 border-black text-black font-black py-6 px-10 h-auto text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                        BACK TO HOME
                    </Button>
                </Link>
            </div>

            {test && (
                <div className="mt-12 text-center p-6 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-black">
                    REPORT GENERATED FOR: {test.title}
                </div>
            )}
        </div>
    );
}

export default function TestResultPage() {
    return (
        <Suspense fallback={<div className="text-foreground p-4">Loading result...</div>}>
            <TestResultContent />
        </Suspense>
    );
}
