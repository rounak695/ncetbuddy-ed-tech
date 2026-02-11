"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getTestById } from "@/lib/appwrite-db";
import { Test, Question } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LatexRenderer } from "@/components/ui/LatexRenderer";
import { useAuth } from "@/context/AuthContext";
import { TestLeaderboard } from "@/components/test/TestLeaderboard";

function TestReviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const testId = searchParams.get("testId");
    const score = parseInt(searchParams.get("score") || "0");
    const totalQuestions = parseInt(searchParams.get("total") || "0");

    const [test, setTest] = useState<Test | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!testId) {
                router.push("/dashboard/tests");
                return;
            }

            try {
                // Fetch test details
                const testData = await getTestById(testId);
                if (testData) {
                    setTest(testData);
                }

                // Get user answers from sessionStorage
                const storedAnswers = sessionStorage.getItem(`test_answers_${testId}`);
                if (storedAnswers) {
                    setUserAnswers(JSON.parse(storedAnswers));
                    // Clear after reading
                    sessionStorage.removeItem(`test_answers_${testId}`);
                }
            } catch (error) {
                console.error("Error loading test review:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [testId, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-black mb-4">Test Not Found</h2>
                    <Button onClick={() => router.push("/dashboard/tests")}>
                        Back to Tests
                    </Button>
                </div>
            </div>
        );
    }

    const maxScore = totalQuestions * 4;
    const percentage = Math.round((score / maxScore) * 100);
    const correctCount = test.questions.filter((q, idx) => userAnswers[idx] === q.correctAnswer).length;
    const incorrectCount = Object.keys(userAnswers).length - correctCount;

    return (
        <div className="min-h-screen bg-gray-50 pb-32 md:pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-xl">
                <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="w-full md:w-auto">
                            <h1 className="text-xl md:text-3xl font-black text-black uppercase italic truncate">
                                Test Review - {test.title}
                            </h1>
                            <p className="text-xs md:text-sm font-bold text-black/60 uppercase tracking-wide mt-1">
                                Correct: {correctCount} • Wrong: {incorrectCount} • Unattempted: {totalQuestions - Object.keys(userAnswers).length}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex-1 md:flex-none text-center px-4 py-2 md:px-6 md:py-3 bg-primary border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="text-xl md:text-3xl font-black text-black">{score}</div>
                                <div className="text-[10px] md:text-xs font-black text-black/60 uppercase">Score</div>
                            </div>
                            <div className="flex-1 md:flex-none text-center px-4 py-2 md:px-6 md:py-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="text-xl md:text-3xl font-black text-black">{percentage}%</div>
                                <div className="text-[10px] md:text-xs font-black text-black/60 uppercase">Accuracy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Leaderboard Section */}
            <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
                {testId && user && (
                    <TestLeaderboard testId={testId} currentUserId={user.$id} />
                )}
            </div>

            {/* Questions Review */}
            <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-4 md:space-y-6">
                {test.questions.map((question: Question, index: number) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === question.correctAnswer;
                    const isAttempted = userAnswer !== undefined;

                    return (
                        <Card
                            key={index}
                            className={`p-4 md:p-6 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${!isAttempted
                                ? "border-gray-400 bg-gray-50"
                                : isCorrect
                                    ? "border-green-500 bg-green-50"
                                    : "border-red-500 bg-red-50"
                                }`}
                        >
                            {/* Question Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b-2 border-black/10">
                                <h3 className="text-base md:text-lg font-black text-black uppercase">
                                    Question {index + 1}
                                </h3>
                                <span
                                    className={`self-start sm:self-auto px-3 py-1.5 md:px-4 md:py-2 rounded-full font-black uppercase text-[10px] md:text-xs border-2 ${!isAttempted
                                        ? "bg-gray-200 border-gray-400 text-gray-700"
                                        : isCorrect
                                            ? "bg-green-500 border-green-700 text-white"
                                            : "bg-red-500 border-red-700 text-white"
                                        }`}
                                >
                                    {!isAttempted ? "⊝ NOT ATTEMPTED" : isCorrect ? "✓ CORRECT" : "✗ WRONG"}
                                </span>
                            </div>

                            {/* Question Text */}
                            <div className="mb-4 md:mb-6 text-base md:text-lg font-bold text-black">
                                <LatexRenderer>{question.text}</LatexRenderer>
                            </div>

                            {/* Options */}
                            <div className="space-y-2 md:space-y-3">
                                {question.options.map((option: string, optIdx: number) => {
                                    const isUserSelection = userAnswer === optIdx;
                                    const isCorrectAnswer = question.correctAnswer === optIdx;

                                    let optionClass = "bg-white border-gray-300";
                                    if (isCorrectAnswer) {
                                        optionClass = "bg-green-100 border-green-500 border-2 md:border-4";
                                    } else if (isUserSelection && !isCorrect) {
                                        optionClass = "bg-red-100 border-red-500 border-2 md:border-4";
                                    }

                                    return (
                                        <div
                                            key={optIdx}
                                            className={`flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-2 ${optionClass} ${isCorrectAnswer || isUserSelection ? "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : ""
                                                }`}
                                        >
                                            <div
                                                className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center font-black text-xs md:text-sm flex-shrink-0 mt-0.5 ${isCorrectAnswer
                                                    ? "bg-green-500 border-green-700 text-white"
                                                    : isUserSelection
                                                        ? "bg-red-500 border-red-700 text-white"
                                                        : "bg-white border-black/20 text-black/60"
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + optIdx)}
                                            </div>
                                            <div className="flex-1 text-sm md:text-base font-bold text-black break-words">
                                                <LatexRenderer>{option}</LatexRenderer>
                                            </div>
                                            <div className="flex flex-col gap-1 items-end mt-0.5">
                                                {isCorrectAnswer && (
                                                    <span className="hidden sm:inline-block px-2 py-0.5 md:px-3 md:py-1 bg-green-500 text-white text-[10px] md:text-xs font-black uppercase rounded-full whitespace-nowrap">
                                                        ✓ Correct
                                                    </span>
                                                )}
                                                {isUserSelection && !isCorrect && (
                                                    <span className="hidden sm:inline-block px-2 py-0.5 md:px-3 md:py-1 bg-red-500 text-white text-[10px] md:text-xs font-black uppercase rounded-full whitespace-nowrap">
                                                        Your Answer
                                                    </span>
                                                )}
                                                {/* Mobile icons only */}
                                                {isCorrectAnswer && (
                                                    <span className="sm:hidden text-green-600 font-bold text-lg">✓</span>
                                                )}
                                                {isUserSelection && !isCorrect && (
                                                    <span className="sm:hidden text-red-600 font-bold text-lg">✗</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black shadow-2xl z-50">
                <div className="max-w-5xl mx-auto px-4 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                    <p className="text-xs md:text-sm font-bold text-black/60 uppercase tracking-wide text-center sm:text-left">
                        Review complete • {correctCount}/{totalQuestions} correct
                    </p>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            onClick={() => router.push("/dashboard/tests")}
                            variant="outline"
                            className="flex-1 sm:flex-none justify-center border-2 border-black text-black hover:bg-black hover:text-white font-black px-4 py-2 md:px-6 md:py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm"
                        >
                            More Tests
                        </Button>
                        <Button
                            onClick={() => router.push("/dashboard/leaderboard")}
                            className="flex-1 sm:flex-none justify-center bg-primary border-2 border-black text-black hover:bg-black hover:text-primary font-black px-4 py-2 md:px-8 md:py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm"
                        >
                            View Leaderboard →
                        </Button>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default function TestReviewPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div></div>}>
            <TestReviewContent />
        </Suspense>
    );
}
