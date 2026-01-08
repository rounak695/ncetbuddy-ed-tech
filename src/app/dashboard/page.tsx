"use client";

import React from 'react';
import Header from '@/components/dashboard/Header';
import Section from '@/components/dashboard/Section';
import { FormulaCard, BookCard, TestCard } from '@/components/dashboard/Cards';

export default function DashboardPage() {
    const formulaCards = [
        { title: 'Current Electricity', items: '12 Formulas', color: '#FFD02F' },
        { title: 'Semiconductors', items: '8 Formulas', color: '#A0E7E5' },
        { title: 'Ray Optics', items: '15 Formulas', color: '#FFAEBC' },
        { title: 'Thermodynamics', items: '10 Formulas', color: '#B4F8C8' },
    ];

    const books = [
        { title: 'Physics Concepts', subtitle: 'Vol 1 & 2' },
        { title: 'PYQ 2024', subtitle: 'Last 10 Years' },
        { title: 'Formula Handbook', subtitle: 'Quick Revision' },
        { title: 'NCERT Solutions', subtitle: 'Class 12' },
        { title: 'Mind Maps', subtitle: 'All Chapters' },
    ];

    const tests = [
        { title: 'PYQ Mock Test 1', tag: 'Full Syllabus • 3 hrs', isNew: true },
        { title: 'Chapter Test: Optics', tag: '30 Questions • 45 mins', isNew: false },
        { title: 'Create Your Own', tag: 'Custom Test • Flexible', isNew: false },
    ];

    return (
        <div className="pb-24 min-h-full">
            <Header />

            <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <Section title="Quick Revision Formula Sheets">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {formulaCards.map((card, index) => (
                            <FormulaCard key={index} {...card} />
                        ))}
                    </div>
                </Section>

                <Section title="Important Digital Books">
                    <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5 md:overflow-visible snap-x snap-mandatory">
                        {books.map((book, index) => (
                            <BookCard key={index} {...book} />
                        ))}
                    </div>
                </Section>

                <Section title="Mock Tests & Practice">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {tests.map((test, index) => (
                            <TestCard key={index} {...test} />
                        ))}
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
