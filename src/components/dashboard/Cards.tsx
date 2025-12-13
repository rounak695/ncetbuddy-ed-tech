import React from 'react';

export function FormulaCard({ title, items, color }: { title: string, items: string, color: string }) {
    return (
        <div style={{
            minWidth: '160px',
            height: '100px',
            background: color,
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#000', // Ensure text is readable on pastel colors
            cursor: 'pointer',
            transition: 'transform 0.2s'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{title}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{items}</div>
        </div>
    );
}

export function BookCard({ title, subtitle, image }: { title: string, subtitle: string, image?: string }) {
    return (
        <div style={{
            minWidth: '140px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            cursor: 'pointer'
        }}>
            <div style={{
                width: '100%',
                height: '180px',
                background: 'var(--card-bg)',
                borderRadius: '12px',
                border: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
            }}>
                {image ? '🖼️' : '📚'}
            </div>
            <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{subtitle}</div>
            </div>
        </div>
    );
}

export function TestCard({ title, tag, isNew }: { title: string, tag?: string, isNew?: boolean }) {
    return (
        <div style={{
            minWidth: '200px',
            background: 'var(--card-bg)',
            padding: '1rem',
            borderRadius: '16px',
            border: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            cursor: 'pointer'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem' }}>📝</div>
                {isNew && <span style={{
                    background: 'var(--primary)',
                    color: '#000',
                    fontSize: '0.6rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                }}>NEW</span>}
            </div>
            <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{title}</div>
                {tag && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tag}</div>}
            </div>
        </div>
    );
}
