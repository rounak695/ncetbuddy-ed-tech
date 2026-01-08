import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-gray-300 ml-1">{label}</label>}
            <input
                className={`px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${error ? 'border-red-500' : ''} ${className || ''}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
        </div>
    );
};
