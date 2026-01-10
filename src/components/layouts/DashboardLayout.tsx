"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-neutral-950 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 animate-pulse">Loading experience...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: "🏠" },
        { href: "/dashboard/books", label: "My Courses", icon: "📚" },
        { href: "/dashboard/videos", label: "Video Classes", icon: "▶️" },
        { href: "/dashboard/tests", label: "Mock Tests", icon: "✍️" },
        { href: "/dashboard/analytics", label: "Analytics", icon: "📊" },
        { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "🏆" },
        { href: "/dashboard/profile", label: "Profile", icon: "👤" },
    ];

    return (
        <div className="flex min-h-screen bg-neutral-950 text-white selection:bg-blue-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-neutral-900/30 backdrop-blur-xl h-screen sticky top-0 z-40">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/25">
                            NB
                        </div>
                        <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                            NCET Buddy
                        </div>
                    </div>
                </div>

                <div className="px-4 py-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Menu</div>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                        ${isActive
                                            ? "bg-blue-600/10 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }
                                    `}
                                >
                                    <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_currentColor]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-white/5">
                    <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <h4 className="font-bold text-white mb-1">Premium Plan</h4>
                            <p className="text-xs text-gray-400 mb-3">Unlock all features & tests</p>
                            <button className="w-full py-2 bg-white text-black font-bold rounded-lg text-xs hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col relative z-0">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                            NB
                        </div>
                        <div className="font-bold text-lg text-white">NCET Buddy</div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? "✕" : "☰"}
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-neutral-950/95 backdrop-blur-xl pt-24 px-6 space-y-2 md:hidden animate-in fade-in slide-in-from-top-10 duration-200">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${pathname === item.href
                                    ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
                                    : "border-white/5 bg-white/5 text-gray-300"
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-lg font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                )}

                <main className="flex-1 p-4 md:p-8 md:px-12 overflow-y-auto w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
