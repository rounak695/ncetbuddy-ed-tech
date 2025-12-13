import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className, title, style }) => {
    return (
        <div className={`${styles.card} ${className || ''}`} style={style}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {children}
        </div>
    );
};
