"use client";

import { ForumComment } from "@/types";

function timeAgo(timestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
}

interface CommentCardProps {
    comment: ForumComment;
}

export default function CommentCard({ comment }: CommentCardProps) {
    return (
        <div className="flex gap-3 p-4 rounded-2xl border-2 border-black/5 hover:border-black/15 hover:bg-primary/5 transition-all group">
            <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-sm font-black text-black flex-shrink-0 shadow-sm">
                {comment.authorName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-black">{comment.authorName || 'Anonymous'}</span>
                    <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-black/70 font-medium leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
            </div>
        </div>
    );
}
