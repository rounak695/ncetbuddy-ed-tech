"use client";

import { useState } from "react";
import { account } from "@/lib/appwrite";
import { ID, OAuthProvider } from "appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EducatorLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleGoogleLogin = () => {
        try {
            account.createOAuth2Session(
                OAuthProvider.Google,
                `${window.location.origin}/educator/dashboard`,
                `${window.location.origin}/educator/login`
            );
        } catch (err) {
            console.error(err);
            setError("Failed to initialize Google login");
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await account.createEmailPasswordSession(email, password);
            // Tag user as educator via prefs
            try {
                await account.updatePrefs({ role: "educator" });
            } catch (prefError) {
                console.warn("Failed to set role pref", prefError);
            }
            router.push("/educator/dashboard");
        } catch (err) {
            console.error(err);
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
            {/* Dynamic Background Content */}
            <div className="absolute inset-0 z-0 flex flex-col md:flex-row p-8 md:p-16 gap-8 md:gap-16 items-start justify-center opacity-40 pointer-events-none select-none grayscale">
                <div className="flex-1 max-w-2xl space-y-8 hidden md:block">
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9]">
                        Launch your branded exam portal in <span className="bg-black text-primary px-2">days</span> — not weeks.
                    </h1>
                    <p className="text-xl font-bold opacity-70">
                        Bring your students. We’ll handle the exam tech, proctoring, and scaling — so you can focus on teaching and earning.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            "FREE ENTRY. No setup fees.",
                            "Create UNLIMITED mock tests for FREE.",
                            "Revenue share model — earn when your students buy.",
                            "Managed proctoring + strict mode.",
                            "Auto-scaling infrastructure.",
                            "Not tech-savvy? We guide you for FREE."
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center mt-1 flex-shrink-0">
                                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="font-bold text-sm leading-tight">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1" /> {/* Spacer for card */}
            </div>

            {/* Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/60 border-2 border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-3xl p-6 md:p-10 flex flex-col gap-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Educator Login</h2>
                    <p className="font-bold text-sm opacity-60">Launch your own test series today</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-2 rounded-xl text-sm font-bold animate-pulse">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="w-full h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:-translate-y-0.5 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none font-bold"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                </button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t-2 border-black/10"></div>
                    <span className="flex-shrink-0 mx-4 font-bold text-xs opacity-40 uppercase">Or continue with email</span>
                    <div className="flex-grow border-t-2 border-black/10"></div>
                </div>

                <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase tracking-wider ml-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 bg-white border-2 border-black rounded-xl px-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-black uppercase tracking-wider">Password</label>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 bg-white border-2 border-black rounded-xl px-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary hover:text-black hover:-translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-none mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging in..." : "Login to Dashboard"}
                    </button>
                </form>

                <div className="text-center space-y-4 pt-2">
                    <p className="text-xs font-bold">
                        New here?{" "}
                        <Link href="#" className="underline hover:text-primary">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
