import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { getNotifications } from "@/lib/appwrite-db";
import { Notification } from "@/types";

export default function Header() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const data = await getNotifications();
            setNotifications(data);
        };
        fetchNotifications();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 relative z-30">
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
                        Welcome back, {user?.name?.split(' ')[0] || "Student"}! 👋
                    </h2>
                    <p className="text-xs md:text-sm text-secondary font-medium">Let's continue your learning journey.</p>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white border border-border hover:bg-black/5 hover:border-black transition-all relative group shadow-sm active:scale-95"
                    >
                        <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">🔔</span>
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute left-0 md:left-auto md:right-0 top-full mt-3 w-[85vw] sm:w-80 md:w-96 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="p-4 bg-primary border-b-4 border-black flex justify-between items-center">
                                <h3 className="font-black text-black uppercase tracking-wider italic text-sm md:text-base">Notifications</h3>
                                <span className="text-[10px] md:text-xs font-bold text-black bg-white/20 px-2 py-1 rounded-lg border-2 border-black/10">{notifications.length} New</span>
                            </div>
                            <div className="max-h-[60vh] md:max-h-[300px] overflow-y-auto p-2 space-y-2 bg-white scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 font-bold italic">
                                        No new notifications
                                        <div className="text-2xl mt-2">🔕</div>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className="p-3 md:p-4 rounded-xl border-2 border-black/5 hover:border-black hover:bg-primary/5 transition-all group cursor-pointer relative">
                                            <div className="flex gap-3">
                                                <div className={`
                                                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                                    ${notif.type === 'alert' ? 'bg-red-400' : notif.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}
                                                `}>
                                                    {notif.type === 'alert' ? '⚠️' : notif.type === 'success' ? '🎉' : 'ℹ️'}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-sm text-black group-hover:text-primary-dark transition-colors">{notif.title}</h4>
                                                    <p className="text-xs text-black/60 font-medium mt-1 leading-snug">{notif.message}</p>
                                                    <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-2 block">
                                                        {new Date(notif.createdAt * 1000).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <div className="p-3 bg-gray-50 border-t-2 border-black text-center">
                                    <button className="text-xs font-black uppercase tracking-widest text-black hover:text-primary transition-colors underline decoration-2 underline-offset-2">
                                        Mark all as read
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-black/5 transition-colors cursor-pointer group whitespace-nowrap shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-secondary group-hover:text-foreground">Live Classes</span>
                </div>

                <Link href="/" className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-2 md:px-5 md:py-2.5 rounded-xl cursor-pointer hover:bg-primary/20 transition-all justify-between md:justify-start shadow-sm whitespace-nowrap hidden lg:flex">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">🎯</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-secondary font-bold uppercase tracking-wider hidden md:block">Daily Goal</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs md:text-sm font-bold text-foreground">0/75 Qs</span>
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
