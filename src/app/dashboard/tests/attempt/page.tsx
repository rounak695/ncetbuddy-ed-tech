"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter, useSearchParams } from "next/navigation";
import { getTestById, saveTestResult } from "@/lib/appwrite-db";
import { useAuth } from "@/context/AuthContext";
import { Test, Question } from "@/types";

export default function TestRunnerPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const testId = searchParams.get("id");
    const { user } = useAuth();

    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [markedForReview, setMarkedForReview] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    // Fetch test data
    useEffect(() => {
        const fetchTest = async () => {
            if (!testId) {
                router.push("/dashboard/tests");
                return;
            }
            try {
                const data = await getTestById(testId);
                if (data && data.questions && data.questions.length > 0) {
                    setTest(data);
                    setTimeLeft(data.duration * 60);
                } else {
                    alert("Test not found or has no questions");
                    router.push("/dashboard/tests");
                }
            } catch (error) {
                console.error("Error loading test:", error);
                alert("Failed to load test");
                router.push("/dashboard/tests");
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [testId, router]);

    // Timer Logic
    useEffect(() => {
        if (!test || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [test]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    };

    const toggleMarkForReview = () => {
        if (markedForReview.includes(currentQuestionIndex)) {
            setMarkedForReview(prev => prev.filter(i => i !== currentQuestionIndex));
        } else {
            setMarkedForReview(prev => [...prev, currentQuestionIndex]);
        }
    };

    const handleSubmit = async () => {
        if (!test || !user) return;
        setIsSubmitModalOpen(false);

        // Calculate score
        let score = 0;
        test.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                score += 4;
            } else if (answers[index] !== undefined) {
                score -= 1; // Negative marking
            }
        });

        try {
            await saveTestResult({
                userId: user.$id,
                testId: testId,
                score: score,
                totalQuestions: test.questions.length,
                answers: answers,
                completedAt: Math.floor(Date.now() / 1000)
            });
        } catch (error) {
            console.error("Error saving result:", error);
        }

        router.push(`/dashboard/tests/result?testId=${testId}&score=${score}&total=${test.questions.length}`);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-neutral-950 z-50 flex items-center justify-center">
                <div className="text-white text-xl">Loading test...</div>
            </div>
        );
    }

    if (!test || !test.questions || test.questions.length === 0) {
        return (
            <div className="fixed inset-0 bg-neutral-950 z-50 flex items-center justify-center">
                <div className="text-white text-xl">No questions found in this test</div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className="fixed inset-0 bg-neutral-950 z-50 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-neutral-900 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="font-bold text-lg text-white">{test.title}</div>
                    <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400">
                        {test.subject || "General"}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <Button onClick={() => setIsSubmitModalOpen(true)} className="bg-red-500 hover:bg-red-600 text-white px-6">
                        Submit Test
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content - Question Area */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <Card className="max-w-4xl mx-auto min-h-[500px] flex flex-col bg-neutral-900 border-white/10">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Question {currentQuestionIndex + 1}</h2>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-gray-500">
                                    {answers[currentQuestionIndex] !== undefined ? 'Attempted' : 'Not Attempted'}
                                </span>
                                {markedForReview.includes(currentQuestionIndex) && (
                                    <span className="text-xs font-bold text-purple-400">Review</span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 p-8">
                            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
                                {currentQuestion.text}
                            </p>

                            <div className="space-y-4">
                                {currentQuestion.options && currentQuestion.options.map((opt, i) => (
                                    <label
                                        key={i}
                                        className={`
                                            flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                                            ${answers[currentQuestionIndex] === i
                                                ? 'bg-blue-600/20 border-blue-500 text-white'
                                                : 'bg-neutral-800 border-white/5 text-gray-400 hover:bg-neutral-800/80 hover:border-white/10'
                                            }
                                        `}
                                    >
                                        <div className={`
                                            w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold
                                            ${answers[currentQuestionIndex] === i ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-600'}
                                        `}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <input
                                            type="radio"
                                            name="option"
                                            className="hidden"
                                            checked={answers[currentQuestionIndex] === i}
                                            onChange={() => handleAnswer(i)}
                                        />
                                        <span className="text-base">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 flex justify-between items-center bg-neutral-900/50">
                            <div className="flex gap-4">
                                <Button
                                    onClick={toggleMarkForReview}
                                    variant="outline"
                                    className={`border-purple-500/50 text-purple-400 hover:bg-purple-500/10 ${markedForReview.includes(currentQuestionIndex) ? 'bg-purple-500/20' : ''}`}
                                >
                                    {markedForReview.includes(currentQuestionIndex) ? 'Unmark Review' : 'Mark for Review'}
                                </Button>
                                <Button
                                    onClick={() => setAnswers(prev => {
                                        const next = { ...prev };
                                        delete next[currentQuestionIndex];
                                        return next;
                                    })}
                                    variant="outline"
                                    className="border-gray-700 text-gray-400 hover:text-white"
                                >
                                    Clear Response
                                </Button>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    variant="outline"
                                    className="border-white/10 text-white hover:bg-white/5 disabled:opacity-50"
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-8"
                                >
                                    {currentQuestionIndex === test.questions.length - 1 ? 'Finish Section' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </main>

                {/* Sidebar - Question Palette */}
                <aside className="w-80 bg-neutral-900 border-l border-white/10 flex flex-col">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="font-bold text-white mb-4">Question Palette</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div> Attempted
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400"></div> Reviewed
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-neutral-700"></div> Unvisited
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-white/10 border border-gray-600"></div> Skipped
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-5 gap-3">
                            {test.questions.map((q, i) => {
                                let statusClass = "bg-neutral-800 text-gray-400 border-transparent hover:border-gray-500"; // Unvisited
                                if (currentQuestionIndex === i) statusClass = "ring-2 ring-blue-500 ring-offset-2 ring-offset-neutral-900 bg-neutral-700 text-white";
                                else if (markedForReview.includes(i)) statusClass = "bg-purple-500/20 text-purple-400 border border-purple-500/50";
                                else if (answers[i] !== undefined) statusClass = "bg-green-500 text-black font-bold";
                                else if (i < currentQuestionIndex) statusClass = "bg-white/5 text-red-400 border border-red-500/20"; // Skipped assumption

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentQuestionIndex(i)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all border ${statusClass}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Submit Confirmation Modal */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-neutral-900 border-white/10 p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center text-3xl mx-auto mb-4">
                            ⚠️
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Submit Test?</h2>
                        <p className="text-gray-400 mb-6">
                            You have attempted <span className="text-white font-bold">{Object.keys(answers).length}</span> out of <span className="text-white font-bold">{test.questions.length}</span> questions.
                            <br />Are you sure you want to finish?
                        </p>
                        <div className="flex gap-4">
                            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)} className="flex-1 border-white/10 text-white hover:bg-white/5">
                                Continue Test
                            </Button>
                            <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white">
                                Submit
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

