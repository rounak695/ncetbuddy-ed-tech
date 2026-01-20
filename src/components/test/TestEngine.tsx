"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import styles from "./TestEngine.module.css";
import { useRouter } from "next/navigation";
import { getTestById, saveTestResult } from "@/lib/appwrite-db";
import { useAuth } from "@/context/AuthContext";
import { Test, Question } from "@/types";
import { LatexRenderer } from "@/components/ui/LatexRenderer";

interface TestEngineProps {
    testId: string;
}

export const TestEngine: React.FC<TestEngineProps> = ({ testId }) => {
    const router = useRouter();
    const { user } = useAuth();
    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
    const [visited, setVisited] = useState<Set<number>>(new Set([0]));
    const [timeLeft, setTimeLeft] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const fetchTest = async () => {
            if (!testId) return;
            const data = await getTestById(testId);
            if (data) {
                setTest(data);
                setTimeLeft(data.duration * 60);
            }
            setLoading(false);
        };
        fetchTest();
    }, [testId]);

    const calculateScore = () => {
        if (!test) return 0;
        let score = 0;
        test.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                score += 4;
            } else if (answers[index] !== undefined) {
                score -= 1;
            }
        });
        return score;
    };

    const handleSubmit = async () => {
        if (!test || !user) return;
        const score = calculateScore();
        const result = {
            userId: user.$id,
            testId: testId,
            score: Math.max(0, score), // Ensure score is non-negative
            totalQuestions: test.questions.length,
            answers: answers,
            completedAt: Math.floor(Date.now() / 1000)
        };
        await saveTestResult(result);
        alert(`Test Submitted! Your Score: ${score}/${test.questions.length * 4}`);
        router.push("/dashboard/leaderboard");
    };

    // Strict Mode Logic
    const handleViolation = () => {
        if (!hasStarted) return;
        alert("Action Prohibited! You exited full screen or switched tabs. The test will be auto-submitted.");
        handleSubmit();
    };

    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.error("Error attempting to enable full-screen mode:", err.message);
            });
        }
    };

    const startTest = () => {
        setHasStarted(true);
        enterFullScreen();
    };

    useEffect(() => {
        if (!hasStarted) return;

        const handleFullScreenChange = () => {
            if (!document.fullscreenElement) {
                handleViolation();
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation();
            }
        };

        const handleResize = () => {
            // Optional: Check if window size is significantly reduced
            // NTA usually just cares about Full Screen, but let's be strict if window isn't maximized-ish
            if (window.innerHeight < screen.height * 0.9 || window.innerWidth < screen.width * 0.9) {
                // Often redundant with fullscreen check, but added for safety
            }
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("resize", handleResize);

        // Prevent right click
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener("contextmenu", handleContextMenu);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasStarted]);

    // Timer only runs if started
    useEffect(() => {
        if (!test || !hasStarted || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [test, hasStarted, timeLeft]);

    const handleOptionSelect = (optionIndex: number) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const handleNext = () => {
        if (test && currentQuestionIndex < test.questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setVisited((prev) => new Set(prev).add(nextIndex));
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
            setVisited((prev) => new Set(prev).add(currentQuestionIndex - 1));
        }
    };

    const handleSaveAndNext = () => {
        // Just move next, answer is already in state if selected
        // Ensure current is marked visited (already done by default logic mostly, but good to ensure)
        if (test && currentQuestionIndex < test.questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setVisited((prev) => new Set(prev).add(nextIndex));
        }
    };

    const handleClearResponse = () => {
        setAnswers((prev) => {
            const newAnswers = { ...prev };
            delete newAnswers[currentQuestionIndex];
            return newAnswers;
        });
    };

    const handleMarkForReviewAndNext = () => {
        setMarkedForReview((prev) => new Set(prev).add(currentQuestionIndex));
        if (test && currentQuestionIndex < test.questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setVisited((prev) => new Set(prev).add(nextIndex));
        }
    };

    const jumpToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
        setVisited((prev) => new Set(prev).add(index));
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getPaletteClass = (index: number) => {
        let className = "";
        const isAnswered = answers[index] !== undefined;
        const isMarked = markedForReview.has(index);
        const isVisited = visited.has(index);

        if (isAnswered && isMarked) className = styles.markedAnswered;
        else if (isMarked) className = styles.marked;
        else if (isAnswered) className = styles.answered;
        else if (isVisited && !isAnswered) className = styles.notAnswered;
        else className = styles.notVisited;

        if (index === currentQuestionIndex) {
            className += ` ${styles.active}`;
        }
        return className;
    };

    if (loading) return <div className="p-8 text-white">Loading test...</div>;
    if (!test) return <div className="p-8 text-white">Test not found.</div>;

    if (!hasStarted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
                    <h1 className="text-2xl font-bold mb-4 text-center">{test.title} - Instructions</h1>
                    <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
                        <li>The clock will be set at the server. The countdown timer at the top right corner of screen will display the remaining time available for you to complete the examination.</li>
                        <li>The examination will end by itself when the timer reaches zero. You will not be required to end or submit your examination.</li>
                        <li><strong>Strict Mode:</strong> This test is proctored. Switching tabs, minimizing the window, or exiting full screen will result in <strong>immediate auto-submission</strong>.</li>
                        <li>Please ensure you have a stable internet connection.</li>
                    </ul>
                    <div className="flex justify-center">
                        <Button variant="primary" style={{ backgroundColor: "#337ab7", fontSize: '1.2rem', padding: '10px 30px' }} onClick={startTest}>
                            I am ready to begin
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    {test.title}
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.candidateInfo}>
                        <div className={styles.candidateImg}></div>
                        <span>{user?.name || "Candidate Name"}</span>
                    </div>
                </div>
            </div>

            <div className={styles.body}>
                {/* Main Question Area */}
                <div className={styles.mainArea}>
                    <div className={styles.questionHeader}>
                        <div className={styles.sectionBar}>
                            Section: General
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#d9534f' }}>
                            Marks: +4, -1
                        </div>
                    </div>

                    <div className={styles.scrollableContent}>
                        <div className={styles.questionText}>
                            <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>Question {currentQuestionIndex + 1}:</h3>
                            <LatexRenderer>{currentQuestion.text}</LatexRenderer>
                            {currentQuestion.imageUrl && (
                                <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={currentQuestion.imageUrl}
                                        alt="Question detailed view"
                                        style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "4px", border: "1px solid #ddd" }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.options}>
                            {currentQuestion.options.map((option, index) => (
                                <label key={index} className={styles.option}>
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestionIndex}`}
                                        checked={answers[currentQuestionIndex] === index}
                                        onChange={() => handleOptionSelect(index)}
                                    />
                                    <span>
                                        <LatexRenderer>{option}</LatexRenderer>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className={`${styles.actionBtn} ${styles.btnDanger}`} onClick={handleClearResponse}>
                                Clear Response
                            </button>
                            <button className={`${styles.actionBtn} ${styles.btnReview}`} onClick={handleMarkForReviewAndNext}>
                                Mark for Review & Next
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className={styles.actionBtn}
                                onClick={handlePrev}
                                disabled={currentQuestionIndex === 0}
                            >
                                Back
                            </button>
                            <button
                                className={`${styles.actionBtn} ${styles.btnPrimary}`}
                                onClick={handleSaveAndNext}
                            >
                                Save & Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Palette) */}
                <div className={styles.sidebar}>
                    <div className={styles.timerBox}>
                        Time Left: <span className={styles.timerText}>{formatTime(timeLeft)}</span>
                    </div>

                    <div className={styles.userProfile} style={{ padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#fff' }}>
                        <div className={styles.userAvatar}>{user?.name?.[0] || "U"}</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user?.name || "Candidate"}</span>
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>{user?.email}</span>
                        </div>
                    </div>

                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendIcon} ${styles.statusNotVisited}`} style={{ border: '1px solid #ccc' }}></div>
                            <span>Not Visited</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendIcon} ${styles.statusNotAnswered}`}>0</div>
                            <span>Not Answered</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendIcon} ${styles.answered}`}>0</div>
                            <span>Answered</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendIcon} ${styles.marked}`}>0</div>
                            <span>Marked for Review</span>
                        </div>
                        <div className={styles.legendItem} style={{ gridColumn: '1 / -1' }}>
                            <div className={`${styles.legendIcon} ${styles.markedAnswered}`} style={{ position: 'relative' }}>
                                0<span style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#5cb85c', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                            </div>
                            <span>Ans & Marked for Review</span>
                        </div>
                    </div>

                    <div className={styles.paletteHeader}>
                        Question Palette
                    </div>

                    <div className={styles.paletteArea}>
                        <div className={styles.paletteGrid}>
                            {test.questions.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.pBtn} ${getPaletteClass(index)}`}
                                    onClick={() => jumpToQuestion(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.submitBtnContainer}>
                        <button className={styles.fullSubmitBtn} onClick={handleSubmit}>
                            Submit Test
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
