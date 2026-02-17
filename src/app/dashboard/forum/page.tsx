"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getForumPosts, ForumPost } from "@/lib/appwrite-forum";
import { CreatePostModal } from "@/components/forum/CreatePostModal";

// Extended type for UI specific fields if needed, 
// strictly speaking we should use the type from lib
interface UIForumPost extends ForumPost {
    isHot?: boolean;
    commentCount?: number;
}

export default function ForumPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<UIForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const fetchedPosts = await getForumPosts(filter);
            // Transform to UI format if needed (e.g. add isHot logic)
            const uiPosts = fetchedPosts.map(post => ({
                ...post,
                isHot: post.upvotes > 5, // Simple logic for "Hot"
                commentCount: 0 // We'd need to fetch comment counts separately or add to post document
            }));
            setPosts(uiPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [filter]); // Re-fetch when filter changes

    const categories = [
        { id: "All", label: "All Topics", icon: "🌐" },
        { id: "Strategy", label: "Strategy", icon: "🧠" },
        { id: "Doubt", label: "Doubts", icon: "❓" },
        { id: "Exam Update", label: "Updates", icon: "📢" },
        { id: "General", label: "General", icon: "💬" }
    ];

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Strategy': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Doubt': return 'bg-red-100 text-red-700 border-red-200';
            case 'Exam Update': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pb-20">
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPostCreated={fetchPosts}
            />

            {/* Hero Section */}
            <div className="bg-white border-b-2 border-black pb-10 pt-8 px-6 md:px-12 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 select-none pointer-events-none">
                    <span className="text-9xl">💬</span>
                </div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                        <div className="inline-block px-3 py-1 bg-primary border-2 border-black rounded-lg text-xs font-black uppercase tracking-widest mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            Community Hub
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-black uppercase italic tracking-tighter mb-2">
                            Discussions
                        </h1>
                        <p className="text-lg text-black/60 font-medium max-w-xl">
                            Ask questions, share strategies, and celebrate wins with the top regular students of India.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/dashboard/profile">
                            <Button variant="outline" className="hidden md:flex bg-white text-black border-2 border-black font-bold items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                👤 My Profile
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-black text-white border-2 border-black font-black uppercase tracking-wide px-8 py-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_0px_rgba(255,208,47,1)] hover:-translate-y-1 transition-all flex items-center gap-2"
                        >
                            <span>✍️</span> Start Discussion
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left Sidebar - Navigation/Filters (Desktop) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-24">
                        <h3 className="font-black text-black uppercase tracking-widest text-xs mb-4 ml-2 opacity-50">Filter by Topic</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFilter(cat.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all border-2
                                        ${filter === cat.id
                                            ? "bg-primary border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-1"
                                            : "bg-transparent border-transparent text-black/60 hover:bg-black/5 hover:text-black"
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="text-xl">{cat.icon}</span>
                                        {cat.label}
                                    </span>
                                    {filter === cat.id && <span className="text-xs">●</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] text-white hidden lg:block">
                        <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-primary">Community Rules</h3>
                        <ul className="space-y-3 text-sm font-medium text-white/80">
                            <li className="flex gap-2"><span>✅</span> <span>Be respectful to everyone.</span></li>
                            <li className="flex gap-2"><span>✅</span> <span>No spam or self-promotion.</span></li>
                            <li className="flex gap-2"><span>✅</span> <span>Keep discussions relevant.</span></li>
                        </ul>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search Bar (Visual Only) */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search discussions..."
                            className="w-full bg-white border-2 border-black rounded-xl px-5 py-4 pl-12 font-bold text-black placeholder:text-black/30 outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</span>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin text-4xl mb-4">⌛</div>
                            <p className="font-black text-black/40 uppercase tracking-widest">Loading Discussions...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post.id} className="group relative bg-white border-2 border-black rounded-2xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer">
                                {post.isHot && (
                                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border-2 border-black shadow-sm transform rotate-3">
                                        🔥 Hot Topic
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    {/* Vote Column */}
                                    <div className="flex flex-col items-center gap-1">
                                        <button className="p-2 rounded-lg hover:bg-gray-100 text-black/40 hover:text-primary transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                        <span className="font-black text-lg">{post.upvotes}</span>
                                        <button className="p-2 rounded-lg hover:bg-gray-100 text-black/40 hover:text-red-500 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-yellow-300 border border-black flex items-center justify-center text-[10px] font-black">
                                                    {post.authorName ? post.authorName.charAt(0) : 'A'}
                                                </div>
                                                <span className="text-xs font-bold text-black">{post.authorName || 'Anonymous'}</span>
                                            </div>
                                            <span className="text-black/20 font-black text-xs">•</span>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${getCategoryColor(post.category)}`}>
                                                {post.category}
                                            </span>
                                            <span className="text-black/40 text-xs font-medium ml-auto">
                                                {new Date(post.createdAt * 1000).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-black text-black mb-2 leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-black/60 font-medium leading-relaxed mb-4 line-clamp-3">
                                            {post.content}
                                        </p>

                                        <div className="flex items-center gap-4 border-t-2 border-black/5 pt-4">
                                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/50 hover:text-black transition-colors">
                                                <span className="text-lg">💬</span> {post.commentCount || 0} Comments
                                            </button>
                                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/50 hover:text-black transition-colors">
                                                <span className="text-lg">📢</span> Share
                                            </button>
                                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/50 hover:text-black transition-colors ml-auto">
                                                <span className="text-lg">🔖</span> Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center border-4 border-dashed border-black/10 rounded-3xl">
                            <p className="text-black/40 font-black uppercase tracking-widest mb-4">No discussions found.</p>
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                variant="outline"
                                className="border-2 border-black font-bold"
                            >
                                Be the first to post!
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Mobile Action Button */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-16 h-16 rounded-full bg-black text-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-3xl hover:scale-110 active:scale-90 transition-all"
                >
                    ➕
                </Button>
            </div>
        </div>
    );
}
