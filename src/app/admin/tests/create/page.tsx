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
        subject: "General",
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
            subject: testData.subject || "General",
            duration: testData.duration || 60,
            questions: questions.map((q, i) => ({ ...q, id: `q-${i + 1}` })),
            createdAt: Math.floor(Date.now() / 1000)
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
                <div style={{ marginTop: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Subject</label>
                    <select
                        value={testData.subject || "General"}
                        onChange={(e) => setTestData({ ...testData, subject: e.target.value })}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg-secondary)",
                            color: "var(--text-primary)",
                            fontSize: "1rem"
                        }}
                    >
                        <option value="General">General</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Maths">Mathematics</option>
                        <option value="Full Mock">Full Mock Test</option>
                    </select>
                </div>
            </Card>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ marginBottom: 0 }}>Questions</h3>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <Button variant="outline" onClick={() => {
                        const template = [
                            {
                                text: "Sample Question? (Supports LaTeX: $E=mc^2$)",
                                imageUrl: "https://example.com/image.png",
                                options: ["Option A", "Option B", "Option C", "Option D"],
                                correctAnswer: 0
                            }
                        ];
                        const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "questions_template.json";
                        a.click();
                        URL.revokeObjectURL(url);
                    }}>
                        Download Template
                    </Button>
                    <div style={{ position: "relative" }}>
                        <Button variant="secondary" onClick={() => document.getElementById("json-upload")?.click()}>
                            Import JSON
                        </Button>
                        <input
                            id="json-upload"
                            type="file"
                            accept=".json"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    try {
                                        const json = JSON.parse(event.target?.result as string);
                                        if (Array.isArray(json)) {
                                            // Validate basic structure
                                            const isValid = json.every(q => q.text && Array.isArray(q.options) && typeof q.correctAnswer === 'number');
                                            if (isValid) {
                                                setQuestions(json);
                                                alert(`Successfully loaded ${json.length} questions!`);
                                            } else {
                                                alert("Invalid JSON format. Please use the template.");
                                            }
                                        } else {
                                            alert("JSON must be an array of questions.");
                                        }
                                    } catch (err) {
                                        alert("Error parsing JSON file.");
                                    }
                                };
                                reader.readAsText(file);
                                // Reset value so same file can be selected again
                                e.target.value = '';
                            }}
                        />
                    </div>
                </div>
            </div>
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
                        placeholder="Enter question here (supports LaTeX e.g., $E=mc^2$)"
                        value={q.text}
                        onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                    />

                    <Input
                        label="Image URL (Optional)"
                        placeholder="https://example.com/image.png"
                        value={q.imageUrl || ""}
                        onChange={(e) => updateQuestion(qIndex, "imageUrl", e.target.value)}
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
