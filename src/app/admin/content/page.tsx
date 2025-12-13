"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function AdminContentPage() {
    const [activeTab, setActiveTab] = useState<"books" | "notes">("books");

    return (
        <div>
            <h1 style={{ marginBottom: "2rem" }}>Content Management</h1>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <Button
                    variant={activeTab === "books" ? "primary" : "outline"}
                    onClick={() => setActiveTab("books")}
                >
                    Books
                </Button>
                <Button
                    variant={activeTab === "notes" ? "primary" : "outline"}
                    onClick={() => setActiveTab("notes")}
                >
                    Notes
                </Button>
            </div>

            <Card title={`Add New ${activeTab === "books" ? "Book" : "Note"}`}>
                <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Input label="Title" placeholder="Enter title" />
                    <Input label="Subject" placeholder="Enter subject" />
                    <Input label="Google Drive URL" placeholder="https://drive.google.com/..." />
                    {activeTab === "books" && <Input label="Cover Image URL" placeholder="https://..." />}
                    <Button type="submit" style={{ alignSelf: "flex-start" }}>Upload</Button>
                </form>
            </Card>
        </div>
    );
}
