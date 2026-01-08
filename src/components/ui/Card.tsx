import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, title, style, onClick }) => {
    return (
        <div
            className={`bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${className || ''}`}
            style={style}
            onClick={onClick}
        >
            {title && <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>}
            {children}
        </div>
    );
};
