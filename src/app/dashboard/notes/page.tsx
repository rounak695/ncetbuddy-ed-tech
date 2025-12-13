"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getBooks } from "@/lib/appwrite-db";
import { Book, FormulaCard } from "@/types";

export default function NotesPage() {
    const [notes, setNotes] = useState<Book[]>([]);
    const [formulas, setFormulas] = useState<FormulaCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Books/Notes
                const booksData = await getBooks();
                setNotes(booksData);

                // Fetch Formula Cards (TODO: Add getFormulaCards to appwrite-db)
                // For now, empty or mock
                setFormulas([]);
            } catch (error) {
                console.error("Error fetching study materials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div style={{ color: "white", padding: "2rem" }}>Loading study materials...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: "2rem" }}>Study Materials</h1>

            <section style={{ marginBottom: "3rem" }}>
                <h2 style={{ marginBottom: "1.5rem", color: "var(--primary)" }}>Notes</h2>
                {notes.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
                        {notes.map((note) => (
                            <Card key={note.id}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: note.thumbnailColor || "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                                        📄
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: "1.1rem", lineHeight: "1.2" }}>{note.title}</h3>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{note.subject}</p>
                                    </div>
                                </div>
                                <a href={note.url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" style={{ width: "100%" }}>Open PDF</Button>
                                </a>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: "var(--text-secondary)" }}>No notes available yet.</p>
                )}
            </section>

            <section>
                <h2 style={{ marginBottom: "1.5rem", color: "var(--secondary)" }}>Formula Cards</h2>
                {formulas.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
                        {formulas.map((formula) => (
                            <Card key={formula.id}>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>{formula.title}</h3>
                                {formula.content && <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.9rem" }}>{formula.content.substring(0, 100)}...</p>}
                                {formula.imageUrl && (
                                    <div style={{ marginBottom: "1rem", borderRadius: "8px", overflow: "hidden" }}>
                                        <img src={formula.imageUrl} alt={formula.title} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: "var(--text-secondary)" }}>No formula cards available yet.</p>
                )}
            </section>
        </div>
    );
}
