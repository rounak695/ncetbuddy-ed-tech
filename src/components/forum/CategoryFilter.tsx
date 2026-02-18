"use client";

import { ForumCategory } from "@/types";

const categories: { value: ForumCategory | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '🔥' },
    { value: 'general', label: 'General', icon: '💬' },
    { value: 'doubts', label: 'Doubts', icon: '❓' },
    { value: 'tips', label: 'Tips', icon: '💡' },
];

interface CategoryFilterProps {
    active: ForumCategory | 'all';
    onChange: (category: ForumCategory | 'all') => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
    return (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => {
                const isActive = active === cat.value;
                return (
                    <button
                        key={cat.value}
                        onClick={() => onChange(cat.value)}
                        className={`
                            flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all duration-200
                            font-black text-sm uppercase tracking-tight whitespace-nowrap
                            ${isActive
                                ? 'bg-primary border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                : 'border-black/10 bg-white text-black hover:bg-primary/10 hover:border-black/20'
                            }
                        `}
                    >
                        <span className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                            {cat.icon}
                        </span>
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}
