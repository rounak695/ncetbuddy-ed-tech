import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { user } = useAuth();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
                <Link href="/dashboard/profile" className="relative group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary p-[2px] shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center text-lg md:text-xl border border-white/20">
                            👤
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-card rounded-full shadow-sm"></div>
                </Link>
                <div>
                    <h2 className="text-base md:text-lg font-bold text-foreground leading-tight">
                        Welcome back, {user?.displayName?.split(' ')[0] || "Student"}! 👋
                    </h2>
                    <p className="text-xs md:text-sm text-secondary font-medium">Let's continue your learning journey.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-black/5 transition-colors cursor-pointer group whitespace-nowrap shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-secondary group-hover:text-foreground">Live Classes</span>
                </Link>

                <Link href="/" className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-2 md:px-5 md:py-2.5 rounded-xl cursor-pointer hover:bg-primary/20 transition-all w-full md:w-auto justify-between md:justify-start shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">🎯</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-secondary font-bold uppercase tracking-wider hidden md:block">Daily Goal</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs md:text-sm font-bold text-foreground">0/75 Qs</span>
                                {/* Mini Progress Bar */}
                                <div className="w-12 md:w-16 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                                    <div className="w-0 h-full bg-primary rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="text-secondary text-sm ml-2 font-bold">→</span>
                </Link>
            </div>
        </div>
    );
}
