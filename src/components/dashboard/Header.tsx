import React from 'react';

export default function Header() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'var(--background)',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                }}>
                    👤
                </div>
                <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Hello, Student</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1 device active</div>
                </div>
            </div>

            <div style={{
                background: 'var(--card-bg)',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid #333'
            }}>
                <span>🎯</span>
                <span>0/75 Qs</span>
                <span style={{ color: 'var(--primary)' }}>→</span>
            </div>
        </div>
    );
}
