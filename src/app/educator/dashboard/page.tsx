"use client";

import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite-educator";
import { useRouter } from "next/navigation";
import { Models } from "appwrite";

export default function EducatorDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await account.get();
                const prefs = await account.getPrefs();

                if (prefs.role !== "educator") {
                    // If logged in but not educator
                    console.warn("User is not an educator");
                    // Optional: Redirect to correct dashboard based on role or show error
                }

                setUser(userData);
            } catch (err) {
                console.error("Not authenticated", err);
                router.push("/educator/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            router.push("/");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Educator Dashboard</h1>
                        <p className="font-bold opacity-60">Welcome back, {user.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-black text-white rounded-xl font-bold uppercase hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border-2 border-black h-64 flex items-center justify-center opacity-50">
                        <span className="font-bold uppercase tracking-widest">Mock Tests (Coming Soon)</span>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border-2 border-black h-64 flex items-center justify-center opacity-50">
                        <span className="font-bold uppercase tracking-widest">Students (Coming Soon)</span>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border-2 border-black h-64 flex items-center justify-center opacity-50">
                        <span className="font-bold uppercase tracking-widest">Revenue (Coming Soon)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
