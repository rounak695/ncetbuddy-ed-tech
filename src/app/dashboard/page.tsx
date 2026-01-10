"use client";

import React from 'react';
import Header from '@/components/dashboard/Header';
import Section from '@/components/dashboard/Section';
import { FormulaCard, BookCard, TestCard } from '@/components/dashboard/Cards';
import { useEffect, useState } from 'react';
import { getBooks, getFormulaCards, getTests } from '@/lib/appwrite-db';
import { Book, FormulaCard as FormulaCardType, Test } from '@/types';

export default function DashboardPage() {
    const [formulaCards, setFormulaCards] = useState<FormulaCardType[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedCards, fetchedBooks, fetchedTests] = await Promise.all([
                    getFormulaCards(),
                    getBooks(),
                    getTests()
                ]);
                setFormulaCards(fetchedCards);
                setBooks(fetchedBooks);
                setTests(fetchedTests);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="pb-24 min-h-full">
            <Header />

            <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <Section title="Quick Revision Formula Sheets">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {loading ? (
                            <p className="text-gray-400 col-span-full">Loading...</p>
                        ) : formulaCards.length === 0 ? (
                            <p className="text-gray-400 col-span-full">No formula cards available.</p>
                        ) : (
                            formulaCards.map((card, index) => (
                                <FormulaCard
                                    key={index}
                                    title={card.title}
                                    items="View Details"
                                    color="#A0E7E5"
                                />
                            ))
                        )}
                    </div>
                </Section>

                <Section title="Important Digital Books">
                    <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5 md:overflow-visible snap-x snap-mandatory">
                        {loading ? (
                            <p className="text-gray-400 col-span-full">Loading...</p>
                        ) : books.length === 0 ? (
                            <p className="text-gray-400 col-span-full">No books available.</p>
                        ) : (
                            books.map((book, index) => (
                                <BookCard
                                    key={index}
                                    title={book.title}
                                    subtitle={book.subject}
                                />
                            ))
                        )}
                    </div>
                </Section>

                <Section title="Mock Tests & Practice">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {loading ? (
                            <p className="text-gray-400 col-span-full">Loading...</p>
                        ) : tests.length === 0 ? (
                            <p className="text-gray-400 col-span-full">No tests available.</p>
                        ) : (
                            tests.slice(0, 3).map((test, index) => (
                                <TestCard
                                    key={index}
                                    title={test.title}
                                    tag={`${test.questions.length} Questions • ${test.duration} mins`}
                                    isNew={index === 0}
                                />
                            ))
                        )}
                    </div>
                </Section>

                <Section title="Notes & PDFs">
                    <div className="w-full bg-gradient-to-tr from-neutral-900 via-neutral-900 to-neutral-800 border border-dashed border-white/20 rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center text-center hover:bg-neutral-800/80 transition-all cursor-pointer group hover:border-blue-500/30 shadow-lg shadow-black/20">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl md:text-3xl">📂</span>
                        </div>
                        <div className="font-bold text-lg md:text-xl text-gray-200 group-hover:text-blue-400 transition-colors">Access Resource Library</div>
                        <p className="text-xs md:text-sm text-gray-400 mt-2 max-w-md">
                            Browse our extensive collection of handwritten notes, important derivations, and previous year wisdom.
                        </p>
                    </div>
                </Section>
            </div>
        </div>
    );
}
