"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Home, PlayCircle, Radio, PenLine, CalendarDays, BarChart2,
    Trophy, MessageCircle, UserCircle, Menu, X
} from "lucide-react";

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
            <div className="flex justify-center items-center h-screen bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-secondary animate-pulse">Loading experience...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
        { href: "/dashboard/videos", label: "Videos", icon: <PlayCircle size={20} /> },
        { href: "/dashboard/live-classes", label: "Live Classes", icon: <Radio size={20} /> },
        { href: "/dashboard/tests", label: "Mock Tests", icon: <PenLine size={20} /> },
        { href: "/dashboard/planner", label: "Smart Planner", icon: <CalendarDays size={20} /> },
        { href: "/dashboard/analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
        { href: "/dashboard/leaderboard", label: "Leaderboard", icon: <Trophy size={20} /> },
        { href: "/dashboard/forum", label: "Discussions", icon: <MessageCircle size={20} /> },
        { href: "/dashboard/profile", label: "Profile", icon: <UserCircle size={20} /> },
    ];

    const isAttemptPage = pathname === "/dashboard/tests/attempt";

    if (isAttemptPage) {
        return <div className="min-h-screen bg-background">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-72 flex-col border-r-2 border-black bg-white backdrop-blur-xl h-screen sticky top-0 z-40 shadow-2xl">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] bg-white">
                            <img src="/logo.png" alt="NCET Buddy" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xl font-black text-black uppercase tracking-tighter">
                            NCET Buddy
                        </div>
                    </div>
                </div>

                <div className="px-4 py-6">
                    <div className="text-xs font-black text-black uppercase tracking-widest px-4 mb-4 opacity-40">Main Menu</div>
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        group flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 border-2
                                        ${isActive
                                            ? "bg-primary border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                            : "border-transparent text-black hover:bg-primary/10 hover:border-black/10 font-bold"
                                        }
                                    `}
                                >
                                    <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-black text-sm uppercase tracking-tight">{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-black shadow-sm" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t-2 border-black">
                    <div className="bg-black rounded-3xl p-6 relative overflow-hidden group shadow-2xl border-2 border-black">
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <h4 className="font-black text-primary mb-1 uppercase tracking-tighter italic text-lg">Go Pro</h4>
                            <p className="text-xs text-white/70 mb-4 font-bold">Access all tests & notes</p>
                            <Link href="/" className="w-full block">
                                <button className="w-full py-3 bg-primary text-black font-black rounded-xl text-xs hover:bg-white transition-all shadow-xl hover:-translate-y-1">
                                    UPGRADE NOW
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col relative z-0">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-50 bg-white border-b-2 border-black p-4 flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-black bg-white">
                            <img src="/logo.png" alt="NCET Buddy" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-black text-lg text-black uppercase tracking-tighter">NCET Buddy</div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 border-2 border-black rounded-xl bg-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-white pt-24 px-6 space-y-4 md:hidden animate-in fade-in slide-in-from-top-10 duration-200">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${pathname === item.href
                                    ? "bg-primary border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    : "border-black bg-white text-black font-black"
                                    }`}
                            >
                                <span className="flex items-center">{item.icon}</span>
                                <span className="text-lg font-black uppercase tracking-tight">{item.label}</span>
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
