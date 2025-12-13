import React from 'react';
import Link from 'next/link';

export default function BottomNav() {
    const navItems = [
        { icon: '🏠', label: 'Home', active: true },
        { icon: '📝', label: 'Tests', active: false },
        { icon: '💎', label: 'Premium', active: false },
        { icon: '📚', label: 'Notes', active: false },
        { icon: '👤', label: 'Profile', active: false },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--card-bg)',
            borderTop: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '0.75rem 0',
            zIndex: 20
        }}>
            {navItems.map((item, index) => (
                <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: item.active ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                }}>
                    <div style={{ fontSize: '1.2rem' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.7rem' }}>{item.label}</div>
                </div>
            ))}
        </div>
    );
}
