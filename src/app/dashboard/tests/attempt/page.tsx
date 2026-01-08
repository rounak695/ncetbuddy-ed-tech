"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getTestById, saveTestResult } from "@/lib/appwrite-db";
import { Test, Question } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function TestAttempt() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    // Test data
    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Attempt state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [markedForReview, setMarkedForReview] = useState<number[]>([]);

    const testId = searchParams.get("id");

    useEffect(() => {
        if (!testId) {
            router.push("/dashboard/tests");
            return;
        }

        const fetchTest = async () => {
            try {
                const data = await getTestById(testId);
                if (!data) {
                    setError("Test not found");
                } else {
                    setTest(data);
                    // Set initial time (minutes to seconds)
                    setTimeRemaining(data.duration * 60);
                }
            } catch (err) {
                console.error("Error loading test:", err);
                setError("Failed to load test");
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [testId, router]);

    const finishTest = useCallback(async () => {
        if (!test || !user || isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Calculate Score
            let score = 0;
            test.questions.forEach((q, idx) => {
                if (answers[idx] === q.correctAnswer) {
                    score += 1; // Assuming 1 point per question for now
                }
            });

            const resultData = {
                userId: user.$id,
                testId: test.id,
                score: score,
                totalQuestions: test.questions.length,
                answers: answers,
                completedAt: Date.now()
            };

            await saveTestResult(resultData);
            router.push(`/dashboard/tests/result?score=${score}&total=${test.questions.length}&testId=${test.id}`);
        } catch (err) {
            console.error("Error submitting test:", err);
            alert("Failed to submit test. Please try again.");
            setIsSubmitting(false);
        }
    }, [test, user, answers, router, isSubmitting]);

    useEffect(() => {
        if (!test || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishTest(); // Auto-submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [test, timeRemaining, finishTest]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (optionIndex: number) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const toggleReview = () => {
        setMarkedForReview(prev => {
            if (prev.includes(currentQuestionIndex)) {
                return prev.filter(i => i !== currentQuestionIndex);
            }
            return [...prev, currentQuestionIndex];
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !test) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
                <h2 className="text-xl font-bold text-red-500 mb-4">{error || "Something went wrong"}</h2>
                <Button onClick={() => router.push("/dashboard/tests")}>Go Back</Button>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-white/10 bg-neutral-900 flex items-center justify-between px-6 z-10">
                <h1 className="font-bold text-lg truncate max-w-[50%]">{test.title}</h1>
                <div className={`text-xl font-mono font-bold px-4 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-400'}`}>
                    {formatTime(timeRemaining)}
                </div>
                <Button
                    onClick={() => {
                        if (confirm("Are you sure you want to finish the test?")) {
                            finishTest();
                        }
                    }}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white border-none"
                >
                    {isSubmitting ? "Submitting..." : "Finish Test"}
                </Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content - Question */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-medium text-gray-400">
                                Question {currentQuestionIndex + 1} of {test.questions.length}
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                    +1.0 / -0.0
                                </span>
                                <button
                                    onClick={toggleReview}
                                    className={`text-sm flex items-center gap-2 ${markedForReview.includes(currentQuestionIndex) ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {markedForReview.includes(currentQuestionIndex) ? '★ Marked' : '☆ Mark for Review'}
                                </button>
                            </div>
                        </div>

                        <Card className="min-h-[400px] flex flex-col p-8 mb-6">
                            <h2 className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                                {currentQuestion.text}
                            </h2>

                            <div className="space-y-4">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${answers[currentQuestionIndex] === idx
                                                ? "bg-blue-600/20 border-blue-500 text-blue-100"
                                                : "bg-neutral-800/50 border-white/5 hover:bg-neutral-800 hover:border-white/10 text-gray-300"
                                            }`}
                                    >
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${answers[currentQuestionIndex] === idx
                                                ? "bg-blue-500 border-blue-500 text-white"
                                                : "border-gray-600 text-gray-500"
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="flex-1">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                                disabled={currentQuestionIndex === test.questions.length - 1}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Question Palette */}
                <div className="w-80 bg-neutral-900 border-l border-white/10 flex flex-col">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="font-bold text-white mb-4">Question Palette</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Answered
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Marked
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-white/10 border border-gray-600"></div> Not Visited
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-white border border-blue-500 block"></span> Current
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-5 gap-2">
                            {test.questions.map((_, idx) => {
                                const isAnswered = answers[idx] !== undefined;
                                const isMarked = markedForReview.includes(idx);
                                const isCurrent = currentQuestionIndex === idx;

                                let classes = "bg-white/5 border-transparent text-gray-400 hover:bg-white/10";
                                if (isCurrent) classes = "bg-white border-2 border-blue-500 text-black font-bold";
                                else if (isMarked) classes = "bg-yellow-500/20 border-yellow-500 text-yellow-500";
                                else if (isAnswered) classes = "bg-blue-600 text-white";

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQuestionIndex(idx)}
                                        className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all border ${classes}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AttemptPage() {
    return (
        <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
            <TestAttempt />
        </Suspense>
    );
}
