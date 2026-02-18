"use client";

import Link from "next/link";
import { ForumPost } from "@/types";

const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
    general: { label: 'General', icon: '💬', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    doubts: { label: 'Doubt', icon: '❓', color: 'bg-red-100 text-red-800 border-red-300' },
    tips: { label: 'Tip', icon: '💡', color: 'bg-green-100 text-green-800 border-green-300' },
};

function timeAgo(timestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
}

interface PostCardProps {
    post: ForumPost;
    currentUserId?: string;
    onLike?: (postId: string) => void;
}

export default function PostCard({ post, currentUserId, onLike }: PostCardProps) {
    const cat = categoryConfig[post.category] || categoryConfig.general;
    const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;

    return (
        <div className="group relative p-1 rounded-3xl bg-gray-100 hover:bg-primary/10 transition-all duration-300">
            <div className="relative bg-card rounded-[20px] p-5 border border-border flex flex-col gap-4 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between">
                    <span className={`text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${cat.color}`}>
                        {cat.icon} {cat.label}
                    </span>
                    <span className="text-[10px] md:text-xs text-black/40 font-bold uppercase tracking-widest">
                        {timeAgo(post.createdAt)}
                    </span>
                </div>
                <Link href={`/dashboard/forum/${post.id}`} className="block">
                    <h3 className="font-bold text-foreground text-[15px] md:text-base leading-snug group-hover:text-black transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    <p className="text-xs md:text-sm text-secondary mt-1.5 line-clamp-2 font-medium leading-relaxed">
                        {post.body}
                    </p>
                </Link>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-black text-black">
                            {post.authorName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="text-xs font-bold text-secondary">{post.authorName || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={(e) => { e.preventDefault(); if (onLike && post.id) onLike(post.id); }}
                            className={`flex items-center gap-1.5 text-xs font-bold transition-all active:scale-90 ${isLiked ? 'text-red-500' : 'text-secondary hover:text-red-500'}`}>
                            <span className="text-sm">{isLiked ? '❤️' : '🤍'}</span>
                            {post.likes.length > 0 && post.likes.length}
                        </button>
                        <Link href={`/dashboard/forum/${post.id}`}
                            className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-foreground transition-colors">
                            <span className="text-sm">💬</span>
                            {post.commentCount > 0 && post.commentCount}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
