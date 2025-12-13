"use client";

import React from 'react';
import Header from '@/components/dashboard/Header';
import BottomNav from '@/components/dashboard/BottomNav';
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
    ];

    const tests = [
        { title: 'PYQ Mock Test 1', tag: 'Full Syllabus', isNew: true },
        { title: 'Chapter Test: Optics', tag: '30 Questions', isNew: false },
        { title: 'Create Your Own', tag: 'Custom Test', isNew: false },
    ];

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh', background: 'var(--background)' }}>
            <Header />

            <div style={{ paddingTop: '1rem' }}>
                <Section title="Formula Cards">
                    {formulaCards.map((card, index) => (
                        <FormulaCard key={index} {...card} />
                    ))}
                </Section>

                <Section title="Important Digital Books">
                    {books.map((book, index) => (
                        <BookCard key={index} {...book} />
                    ))}
                </Section>

                <Section title="Mock Tests">
                    {tests.map((test, index) => (
                        <TestCard key={index} {...test} />
                    ))}
                </Section>

                <Section title="Notes & PDFs">
                    <div style={{
                        width: '100%',
                        background: 'var(--card-bg)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        border: '1px solid #333',
                        textAlign: 'center',
                        color: 'var(--text-secondary)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
                        <div>Access all your notes here</div>
                    </div>
                </Section>
            </div>

            <BottomNav />
        </div>
    );
}
