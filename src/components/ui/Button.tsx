import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading,
    className,
    ...props
}) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";

    const variants = {
        primary: "bg-primary text-black hover:bg-primary-hover shadow-lg shadow-primary/20",
        secondary: "bg-black text-white hover:bg-black/90 shadow-lg shadow-black/10",
        outline: "border border-border text-foreground hover:bg-primary/10",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className || ''}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Loading...
                </div>
            ) : children}
        </button>
    );
};
