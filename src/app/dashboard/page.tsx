"use client";

import React from 'react';
import Header from '@/components/dashboard/Header';
import Section from '@/components/dashboard/Section';
import Link from 'next/link';
import { FormulaCard, BookCard, TestCard } from '@/components/dashboard/Cards';
import { useEffect, useState } from 'react';
import { getBooks, getFormulaCards, getTests } from '@/lib/appwrite-db';
import { Test } from '@/types';

export default function DashboardPage() {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTests = await getTests();
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


                <Section title="Mock Tests & Practice">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {loading ? (
                            <p className="text-secondary font-bold col-span-full">Loading...</p>
                        ) : tests.length === 0 ? (
                            <p className="text-secondary font-bold col-span-full">No tests available.</p>
                        ) : (
                            tests.slice(0, 3).map((test, index) => (
                                <TestCard
                                    key={index}
                                    title={test.title}
                                    tag={`${test.questions.length || 0} Questions • ${test.duration} mins`}
                                    isNew={index === 0}
                                    href={`/dashboard/tests/attempt?id=${test.id}`}
                                />
                            ))
                        )}
                    </div>
                </Section>

                <Section title="Notes & PDFs">
                    <Link href="/dashboard/notes" className="block w-full">
                        <div className="w-full bg-card border border-dashed border-border rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center text-center hover:bg-primary/5 transition-all cursor-pointer group hover:border-primary/50 shadow-lg shadow-black/5">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl md:text-3xl">📂</span>
                            </div>
                            <div className="font-bold text-lg md:text-xl text-foreground group-hover:text-black transition-colors">Access Resource Library</div>
                            <p className="text-xs md:text-sm text-secondary mt-2 max-w-md font-medium">
                                Browse our extensive collection of handwritten notes, important derivations, and previous year wisdom.
                            </p>
                        </div>
                    </Link>
                </Section>

                <Section title="Community">
                    <Link href="/dashboard/forum" className="block w-full">
                        <div className="w-full bg-card border border-dashed border-border rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center text-center hover:bg-primary/5 transition-all cursor-pointer group hover:border-primary/50 shadow-lg shadow-black/5">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl md:text-3xl">💬</span>
                            </div>
                            <div className="font-bold text-lg md:text-xl text-foreground group-hover:text-black transition-colors">Discussion Forum</div>
                            <p className="text-xs md:text-sm text-secondary mt-2 max-w-md font-medium">
                                Ask doubts, share tips, and connect with fellow students preparing together.
                            </p>
                        </div>
                    </Link>
                </Section>
            </div>
        </div>
    );
}
