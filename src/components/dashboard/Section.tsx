import React from 'react';

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{
                padding: '0 1rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{title}</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}>See All</span>
            </div>
            <div style={{
                display: 'flex',
                overflowX: 'auto',
                padding: '0 1rem',
                gap: '1rem',
                paddingBottom: '1rem', // Space for scrollbar or shadow
                scrollbarWidth: 'none', // Hide scrollbar for cleaner look
                msOverflowStyle: 'none'
            }}>
                {children}
            </div>
        </div>
    );
}
