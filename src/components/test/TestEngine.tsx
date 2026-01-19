"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import styles from "./TestEngine.module.css";
import { useRouter } from "next/navigation";
import { getTestById, saveTestResult } from "@/lib/appwrite-db";
import { useAuth } from "@/context/AuthContext";
import { Test, Question } from "@/types";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

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
    const [visited, setVisited] = useState<Set<number>>(new Set([0]));
    const [timeLeft, setTimeLeft] = useState(0);

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

    const handleSubmit = async () => {
        if (!test || !user) return;

        // Calculate score
        let score = 0;
        test.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                score += 4;
            } else if (answers[index] !== undefined) {
                score -= 1; // Negative marking
            }
        });

        const result = {
            userId: user.$id,
            testId: testId,
            score: score,
            totalQuestions: test.questions.length,
            answers: answers,
            completedAt: Date.now()
        };

        await saveTestResult(result);

        alert(`Test Submitted! Your Score: ${score}/${test.questions.length * 4}`);
        router.push("/dashboard/leaderboard");
    };

    useEffect(() => {
        if (!test || timeLeft <= 0) return;

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
    }, [test, timeLeft]);

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

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div style={{ color: "white", padding: "2rem" }}>Loading test...</div>;
    if (!test) return <div style={{ color: "white", padding: "2rem" }}>Test not found.</div>;

    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.questionHeader}>
                    <h2>Question {currentQuestionIndex + 1}</h2>
                    <span>+4 / -1 Marks</span>
                </div>

                <div className={styles.questionText}>
                    <Latex>{currentQuestion.text}</Latex>
                    {currentQuestion.imageUrl && (
                        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={currentQuestion.imageUrl}
                                alt="Question detailed view"
                                style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "8px" }}
                            />
                        </div>
                    )}
                </div>

                <div className={styles.options}>
                    {currentQuestion.options.map((option, index) => (
                        <div
                            key={index}
                            className={`${styles.option} ${answers[currentQuestionIndex] === index ? styles.selected : ''}`}
                            onClick={() => handleOptionSelect(index)}
                        >
                            <Latex>{`${String.fromCharCode(65 + index)}. ${option}`}</Latex>
                        </div>
                    ))}
                </div>

                <div className={styles.controls}>
                    <Button variant="secondary" onClick={handlePrev} disabled={currentQuestionIndex === 0}>Previous</Button>
                    <Button variant="secondary" onClick={() => setAnswers(prev => {
                        const newAnswers = { ...prev };
                        delete newAnswers[currentQuestionIndex];
                        return newAnswers;
                    })}>Clear Response</Button>
                    <Button onClick={handleNext} disabled={currentQuestionIndex === test.questions.length - 1}>Save & Next</Button>
                </div>
            </div>

            <div className={styles.sidebar}>
                <div className={styles.timer}>
                    Time Left: {formatTime(timeLeft)}
                </div>

                <div className={styles.palette}>
                    <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Question Palette</h3>
                    <div className={styles.paletteGrid}>
                        {test.questions.map((_, index) => {
                            let statusClass = "";
                            if (answers[index] !== undefined) statusClass = styles.answered;
                            else if (visited.has(index)) statusClass = styles.visited;
                            if (currentQuestionIndex === index) statusClass += ` ${styles.active}`;

                            return (
                                <div
                                    key={index}
                                    className={`${styles.paletteBtn} ${statusClass}`}
                                    onClick={() => jumpToQuestion(index)}
                                >
                                    {index + 1}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Button variant="primary" style={{ width: "100%", backgroundColor: "var(--success)" }} onClick={handleSubmit}>
                    Submit Test
                </Button>
            </div>
        </div>
    );
};
