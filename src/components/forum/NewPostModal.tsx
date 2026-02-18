"use client";

import { useState } from "react";
import { ForumCategory } from "@/types";

interface NewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; content: string; category: ForumCategory }) => Promise<void>;
}

export default function NewPostModal({ isOpen, onClose, onSubmit }: NewPostModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<ForumCategory>('General');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        setSubmitting(true);
        try {
            await onSubmit({ title: title.trim(), content: content.trim(), category });
            setTitle(''); setContent(''); setCategory('General'); onClose();
        } catch (error) { console.error("Error submitting post:", error); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="p-5 bg-primary border-b-4 border-black flex justify-between items-center">
                    <h3 className="font-black text-black uppercase tracking-wider italic text-base md:text-lg">New Discussion</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 border-2 border-black/10 flex items-center justify-center font-black text-black hover:bg-white/40 transition-all active:scale-90">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
                    <div>
                        <label className="text-xs font-black text-black uppercase tracking-widest mb-2 block opacity-50">Category</label>
                        <div className="flex gap-2 flex-wrap">
                            {([
                                { value: 'General' as const, icon: '💬', label: 'General' },
                                { value: 'Doubt' as const, icon: '❓', label: 'Doubt' },
                                { value: 'Exam Update' as const, icon: '📢', label: 'Exam Update' },
                                { value: 'Strategy' as const, icon: '💡', label: 'Strategy' },
                            ]).map((cat) => (
                                <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                                    className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all text-xs font-black uppercase tracking-tight
                                        ${category === cat.value ? 'bg-primary border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'border-black/10 bg-white text-black/60 hover:border-black/20'}`}>
                                    <span>{cat.icon}</span>{cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black text-black uppercase tracking-widest mb-2 block opacity-50">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's on your mind?" maxLength={150} required
                            className="w-full px-4 py-3 rounded-xl border-2 border-black/10 bg-white text-black font-bold text-sm placeholder:text-black/30 focus:border-black focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all" />
                    </div>
                    <div>
                        <label className="text-xs font-black text-black uppercase tracking-widest mb-2 block opacity-50">Description</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your thoughts, doubts, or tips..." rows={4} required
                            className="w-full px-4 py-3 rounded-xl border-2 border-black/10 bg-white text-black font-medium text-sm placeholder:text-black/30 focus:border-black focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all resize-none" />
                    </div>
                    <button type="submit" disabled={submitting || !title.trim() || !content.trim()}
                        className="w-full py-4 bg-black text-white font-black uppercase tracking-wider rounded-2xl border-2 border-black hover:bg-primary hover:text-black transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] disabled:shadow-none text-sm">
                        {submitting ? 'Posting...' : '🚀 Post Discussion'}
                    </button>
                </form>
            </div>
        </div>
    );
}
