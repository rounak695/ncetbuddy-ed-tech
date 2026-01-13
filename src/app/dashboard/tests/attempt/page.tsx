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

        // Calculate metrics
        let score = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        test.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                correctCount++;
                score += 4;
            } else if (answers[index] !== undefined) {
                incorrectCount++;
                score -= 1; // Negative marking
            }
        });

        try {
            await saveTestResult({
                userId: user.$id,
                testId: testId,
                score: Math.max(0, score),
                correctCount: correctCount,
                incorrectCount: incorrectCount,
                totalQuestions: test.questions.length,
                answers: answers,
                completedAt: Math.floor(Date.now() / 1000)
            });
        } catch (error) {
            console.error("Error saving result:", error);
        }

        router.push(`/dashboard/tests/result?testId=${testId}&score=${score}&total=${test.questions.length}&correct=${correctCount}&incorrect=${incorrectCount}`);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-black border-t-primary rounded-full animate-spin mb-4"></div>
                <div className="text-black text-2xl font-black uppercase tracking-widest animate-pulse">Loading Test...</div>
            </div>
        );
    }

    if (!test || !Array.isArray(test.questions) || test.questions.length === 0) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-8">
                <div className="text-black text-xl font-black uppercase border-4 border-black p-8 bg-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md">
                    Test not found or has invalid data. Please contact support.
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
            {/* Header */}
            <header className="h-auto md:h-24 border-b-4 border-black bg-white px-4 md:px-8 py-3 md:py-0 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl relative z-20">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="font-black text-lg md:text-2xl text-black uppercase tracking-tighter italic truncate">{test.title}</div>
                    <div className="hidden sm:block px-3 md:px-4 py-1.5 bg-black text-primary rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,208,47,1)]">
                        {test.subject || "General"}
                    </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 w-full md:w-auto">
                    <div className={`text-xl md:text-3xl font-black font-mono px-3 md:px-6 py-1.5 md:py-2 border-2 md:border-4 border-black rounded-xl md:rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${timeLeft < 300 ? 'bg-red-500 text-white animate-pulse' : 'bg-primary text-black'}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <Button onClick={() => setIsSubmitModalOpen(true)} className="bg-black hover:bg-primary hover:text-black text-white px-4 md:px-8 py-2 md:py-4 h-auto text-[10px] md:text-sm font-black uppercase tracking-widest shadow-lg md:shadow-xl border-2 border-black transition-all transform hover:-translate-y-1 active:translate-y-0">
                        Submit
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Main Content - Question Area */}
                <main className="flex-1 p-4 md:p-10 overflow-y-auto bg-white">
                    <Card className="max-w-4xl mx-auto min-h-[400px] md:min-h-[500px] flex flex-col bg-white border-4 border-black rounded-2xl md:rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <div className="p-4 md:p-8 border-b-4 border-black flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-primary/5">
                            <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight italic">Question {currentQuestionIndex + 1}</h2>
                            <div className="flex gap-2 md:gap-3">
                                <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-3 md:px-4 py-1.5 rounded-full border-2 border-black ${answers[currentQuestionIndex] !== undefined ? 'bg-black text-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black'}`}>
                                    {answers[currentQuestionIndex] !== undefined ? 'Attempted' : 'Not Attempted'}
                                </span>
                                {markedForReview.includes(currentQuestionIndex) && (
                                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest px-3 md:px-4 py-1.5 rounded-full bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Review</span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 p-6 md:p-10">
                            <p className="text-lg md:text-2xl text-black font-black leading-snug mb-8 md:mb-10 selection:bg-primary">
                                {currentQuestion.text}
                            </p>

                            <div className="space-y-4 md:space-y-6">
                                {currentQuestion.options && currentQuestion.options.map((opt, i) => (
                                    <label
                                        key={i}
                                        className={`
                                            flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all
                                            ${answers[currentQuestionIndex] === i
                                                ? 'bg-primary border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                                                : 'bg-white border-black/10 text-black hover:border-black hover:bg-primary/5'
                                            }
                                        `}
                                    >
                                        <div className={`
                                            w-6 h-6 md:w-8 md:h-8 rounded-full border-2 md:border-4 flex items-center justify-center text-[10px] md:text-sm font-black flex-shrink-0
                                            ${answers[currentQuestionIndex] === i ? 'bg-black border-black text-primary' : 'border-black/10 text-black/30'}
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
                                        <span className="text-base md:text-lg font-bold">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 md:p-8 border-t-4 border-black flex flex-col md:flex-row gap-6 md:justify-between md:items-center bg-primary/5">
                            <div className="flex gap-2 md:gap-4">
                                <Button
                                    onClick={toggleMarkForReview}
                                    className={`flex-1 md:flex-none bg-white border-2 border-black text-black hover:bg-primary font-black px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${markedForReview.includes(currentQuestionIndex) ? 'bg-primary' : ''}`}
                                >
                                    {markedForReview.includes(currentQuestionIndex) ? 'UNMARK' : 'REVIEW'}
                                </Button>
                                <Button
                                    onClick={() => setAnswers(prev => {
                                        const next = { ...prev };
                                        delete next[currentQuestionIndex];
                                        return next;
                                    })}
                                    variant="outline"
                                    className="flex-1 md:flex-none border-2 border-black text-black hover:bg-black hover:text-white font-black px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    CLEAR
                                </Button>
                            </div>

                            <div className="flex gap-2 md:gap-4">
                                <Button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex-1 md:flex-none bg-white border-2 border-black text-black hover:bg-black hover:text-white disabled:opacity-30 font-black px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    PREV
                                </Button>
                                <Button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                                    className="flex-[2] md:flex-none bg-black hover:bg-primary hover:text-black text-white px-6 md:px-10 py-2 md:py-3 font-black shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] border-2 border-black uppercase tracking-widest text-xs md:text-sm transition-all"
                                >
                                    {currentQuestionIndex === test.questions.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </main>

                {/* Sidebar - Question Palette - Responsive behavior */}
                <aside className="w-full md:w-80 bg-white border-t-4 md:border-t-0 md:border-l-4 border-black flex flex-col shadow-2xl relative z-10 max-h-[30vh] md:max-h-none">
                    <div className="p-4 md:p-8 border-b-2 md:border-b-4 border-black bg-primary sticky top-0 md:relative">
                        <h3 className="font-black text-black uppercase tracking-widest mb-3 md:mb-6 italic text-sm md:text-lg">Question Palette</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 md:gap-4 text-[8px] md:text-[10px] font-black uppercase tracking-tighter">
                            <div className="flex items-center gap-2 text-black">
                                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div> Answered
                            </div>
                            <div className="flex items-center gap-2 text-black">
                                <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-yellow-400 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div> Review
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white">
                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                            {test.questions.map((q, i) => {
                                let statusClass = "bg-white text-black/20 border-black/10 hover:border-black hover:text-black";
                                if (currentQuestionIndex === i) statusClass = "ring-2 md:ring-4 ring-black ring-offset-1 md:ring-offset-2 bg-primary text-black font-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
                                else if (markedForReview.includes(i)) statusClass = "bg-yellow-400 text-black border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
                                else if (answers[i] !== undefined) statusClass = "bg-black text-primary font-black border-black shadow-[2px_2px_0px_0px_rgba(255,208,47,1)] md:shadow-[4px_4px_0px_0px_rgba(255,208,47,1)]";
                                else if (i < currentQuestionIndex) statusClass = "bg-white text-red-500 border-red-500 font-bold opacity-50";

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentQuestionIndex(i)}
                                        className={`w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-sm transition-all border-2 ${statusClass} transform hover:-translate-y-1 active:translate-y-0`}
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
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <Card className="w-full max-w-md bg-white border-4 border-black p-10 text-center animate-in zoom-in-95 duration-200 shadow-[16px_16px_0px_0px_rgba(255,208,47,1)] rounded-3xl">
                        <div className="w-20 h-20 rounded-full bg-primary text-black flex items-center justify-center text-4xl mx-auto mb-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            ⚡
                        </div>
                        <h2 className="text-3xl font-black text-black mb-4 uppercase italic">Submit Test?</h2>
                        <p className="text-black font-bold mb-8 leading-relaxed">
                            You have attempted <span className="bg-primary px-2 py-0.5 rounded border border-black">{Object.keys(answers).length}</span> out of <span className="underline decoration-primary decoration-4">{test.questions.length}</span> questions.
                            <br /><span className="text-xs uppercase tracking-widest opacity-60">Ready to see your results?</span>
                        </p>
                        <div className="flex gap-4">
                            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)} className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white font-black py-4 h-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl transition-all">
                                GO BACK
                            </Button>
                            <Button onClick={handleSubmit} className="flex-1 bg-black hover:bg-primary hover:text-black text-white font-black py-4 h-auto shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] border-2 border-black rounded-xl transition-all">
                                SUBMIT
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

