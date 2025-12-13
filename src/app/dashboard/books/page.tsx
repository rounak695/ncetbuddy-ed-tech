"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function BooksPage() {
    // Placeholder data - to be fetched from Firestore
    const books = [
        {
            id: 1,
            title: "NCET Mathematics Guide",
            image: "https://via.placeholder.com/150",
            url: "#"
        },
        {
            id: 2,
            title: "Physics Formula Book",
            image: "https://via.placeholder.com/150",
            url: "#"
        },
        {
            id: 3,
            title: "Chemistry Handbook",
            image: "https://via.placeholder.com/150",
            url: "#"
        }
    ];

    return (
        <div>
            <h1 style={{ marginBottom: "2rem" }}>Recommended Books</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem" }}>
                {books.map((book) => (
                    <Card key={book.id} style={{ padding: "0", overflow: "hidden" }}>
                        <div style={{ height: "200px", background: "#333" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={book.image} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ padding: "1rem" }}>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>{book.title}</h3>
                            <a href={book.url} target="_blank" rel="noopener noreferrer" style={{ width: "100%" }}>
                                <Button style={{ width: "100%" }}>Read Now</Button>
                            </a>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
