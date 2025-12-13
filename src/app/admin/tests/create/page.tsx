"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { createTest } from "@/lib/appwrite-db";
import { useRouter } from "next/navigation";
import { Test, Question } from "@/types";

export default function CreateTestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [testData, setTestData] = useState<Partial<Test>>({
        title: "",
        description: "",
        duration: 60,
        questions: []
    });
    const [questions, setQuestions] = useState<Omit<Question, "id">[]>([
        { text: "", options: ["", "", "", ""], correctAnswer: 0 }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { text: "", options: ["", "", "", ""], correctAnswer: 0 }]);
    };

    const removeQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index: number, field: keyof Omit<Question, "id">, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex].options = newOptions;
        setQuestions(newQuestions);
    };

    const handlePublish = async () => {
        if (!testData.title) {
            alert("Please enter a test title");
            return;
        }

        setLoading(true);
        const testId = await createTest({
            title: testData.title,
            description: testData.description || "",
            duration: testData.duration || 60,
            questions: questions.map((q, i) => ({ ...q, id: `q-${i + 1}` })),
            createdBy: "admin", // TODO: Get actual user ID
            createdAt: Date.now(),
            isVisible: true
        } as any);

        if (testId) {
            alert("Test published successfully!");
            router.push("/admin/tests");
        } else {
            alert("Failed to publish test.");
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "2rem" }}>Create New Test</h1>

            <Card style={{ marginBottom: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Test Details</h3>
                <Input
                    label="Test Title"
                    placeholder="e.g., NCET Full Mock 1"
                    value={testData.title}
                    onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                />
                <Input
                    label="Duration (minutes)"
                    type="number"
                    placeholder="180"
                    value={testData.duration}
                    onChange={(e) => setTestData({ ...testData, duration: Number(e.target.value) })}
                />
            </Card>

            <h3 style={{ marginBottom: "1rem" }}>Questions</h3>
            {questions.map((q, qIndex) => (
                <Card key={qIndex} style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <h4>Question {qIndex + 1}</h4>
                        <Button
                            variant="outline"
                            style={{ color: "var(--error)", borderColor: "var(--error)" }}
                            onClick={() => removeQuestion(qIndex)}
                        >
                            Remove
                        </Button>
                    </div>

                    <Input
                        label="Question Text"
                        placeholder="Enter question here"
                        value={q.text}
                        onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                        {q.options.map((opt, oIndex) => (
                            <Input
                                key={oIndex}
                                label={`Option ${String.fromCharCode(65 + oIndex)}`}
                                placeholder={`Option ${oIndex + 1}`}
                                value={opt}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            />
                        ))}
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Correct Option</label>
                        <select
                            style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--surface)", color: "white", border: "1px solid #333", width: "100%" }}
                            value={q.correctAnswer}
                            onChange={(e) => updateQuestion(qIndex, "correctAnswer", Number(e.target.value))}
                        >
                            <option value={0}>Option A</option>
                            <option value={1}>Option B</option>
                            <option value={2}>Option C</option>
                            <option value={3}>Option D</option>
                        </select>
                    </div>
                </Card>
            ))}

            <div style={{ display: "flex", gap: "1rem", marginBottom: "4rem" }}>
                <Button variant="secondary" onClick={addQuestion} style={{ flex: 1 }}>+ Add Question</Button>
                <Button variant="primary" style={{ flex: 1 }} onClick={handlePublish} disabled={loading}>
                    {loading ? "Publishing..." : "Publish Test"}
                </Button>
            </div>
        </div>
    );
}
