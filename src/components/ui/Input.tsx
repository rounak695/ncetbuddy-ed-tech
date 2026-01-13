import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-semibold text-secondary ml-1">{label}</label>}
            <input
                className={`px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all ${error ? 'border-error' : ''} ${className || ''}`}
                {...props}
            />
            {error && <span className="text-xs text-error font-medium ml-1">{error}</span>}
        </div>
    );
};
