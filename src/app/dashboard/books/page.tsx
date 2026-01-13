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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div>
                <h1 className="text-3xl font-black text-black">Recommended Books</h1>
                <p className="text-black font-bold opacity-60">Handpicked resources for your preparation</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {books.map((book) => (
                    <Card key={book.id} className="p-0 overflow-hidden border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:-translate-y-2 transition-all">
                        <div className="height-[200px] bg-primary flex items-center justify-center p-8 border-b-4 border-black group-hover:bg-black transition-colors">
                            <div className="text-6xl group-hover:scale-110 transition-transform">📚</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-black text-black mb-6 leading-tight">{book.title}</h3>
                            <a href={book.url} target="_blank" rel="noopener noreferrer" className="block">
                                <Button className="w-full bg-black text-white hover:bg-primary hover:text-black font-black py-4 border-2 border-black transition-all">
                                    READ NOW
                                </Button>
                            </a>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
