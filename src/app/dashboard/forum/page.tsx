"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ForumPost, ForumCategory } from "@/types";
import { getForumPosts, createForumPost, likeForumPost } from "@/lib/appwrite-db";
import CategoryFilter from "@/components/forum/CategoryFilter";
import PostCard from "@/components/forum/PostCard";
import NewPostModal from "@/components/forum/NewPostModal";

export default function ForumPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<ForumCategory | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const category = activeCategory === 'all' ? undefined : activeCategory;
            const data = await getForumPosts(category);
            setPosts(data);
        } catch (error) { console.error("Error loading posts:", error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPosts(); }, [activeCategory]);

    const handleCreatePost = async (data: { title: string; body: string; category: ForumCategory }) => {
        if (!user) return;
        await createForumPost({
            authorId: user.$id, authorName: user.name || 'Anonymous',
            title: data.title, body: data.body, category: data.category,
            likes: [], commentCount: 0, createdAt: Math.floor(Date.now() / 1000),
        });
        await fetchPosts();
    };

    const handleLike = async (postId: string) => {
        if (!user) return;
        const newLikes = await likeForumPost(postId, user.$id);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: newLikes } : p));
    };

    return (
        <div className="pb-24 min-h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-black uppercase tracking-tighter">💬 Discussion Forum</h1>
                    <p className="text-xs md:text-sm text-secondary font-medium mt-1">Ask doubts, share tips, and connect with fellow students.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary border-2 border-black rounded-2xl font-black text-sm uppercase tracking-tight text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95">
                    <span className="text-lg">✍️</span> New Discussion
                </button>
            </div>
            <div className="mb-6"><CategoryFilter active={activeCategory} onChange={setActiveCategory} /></div>
            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-1 rounded-3xl bg-gray-100 animate-pulse">
                                <div className="bg-white rounded-[20px] p-5 border border-border">
                                    <div className="h-4 bg-gray-200 rounded-full w-24 mb-4" />
                                    <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-2" />
                                    <div className="h-4 bg-gray-200 rounded-full w-full mb-2" />
                                    <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                                        <div className="h-7 w-7 bg-gray-200 rounded-full" />
                                        <div className="h-3 bg-gray-200 rounded-full w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4"><span className="text-4xl">🦗</span></div>
                        <h3 className="text-lg font-black text-black uppercase tracking-tight">No discussions yet</h3>
                        <p className="text-sm text-secondary font-medium mt-1 max-w-xs">Be the first to start a conversation! Click &quot;New Discussion&quot; above.</p>
                    </div>
                ) : posts.map((post) => (
                    <PostCard key={post.id} post={post} currentUserId={user?.$id} onLike={handleLike} />
                ))}
            </div>
            <NewPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreatePost} />
        </div>
    );
}
