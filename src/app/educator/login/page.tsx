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

    const handleEmailLogin = async (e: React.FormEvent) => {
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
            setError((err as any).message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 lg:p-12">
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-center">

                {/* Left Column: Marketing Story */}
                <div className="flex flex-col gap-8 text-black">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9]">
                            Launch your branded exam portal in <span className="bg-primary px-2">days</span> — not weeks.
                        </h1>
                        <h2 className="text-xl md:text-2xl font-bold opacity-70">
                            You teach. You grow. We run the exam tech behind the scenes.
                        </h2>
                    </div>

                    <div className="space-y-6 text-lg font-medium opacity-80 leading-relaxed max-w-2xl">
                        <p>
                            You have the students and the content, but building a secure testing platform is complex.
                            We solve that. Our infrastructure handles <span className="font-bold text-black border-b-2 border-primary">heavy traffic spikes</span>,
                            ensures 99.9% uptime, and provides bank-grade security.
                        </p>
                        <p>
                            Focus purely on your teaching. We manage the messy tech—server scaling, strict proctoring,
                            and seamless student experience—so you never have to worry about a crash during a live exam.
                        </p>
                    </div>

                    {/* Mini Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-black/10 pt-6">
                        <div className="flex gap-3 items-center md:block">
                            <span className="text-4xl font-black text-black/10">01</span>
                            <div>
                                <h3 className="font-bold uppercase tracking-wider text-sm">Sign In</h3>
                                <p className="text-xs font-bold opacity-60">Create your profile in seconds.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center md:block">
                            <span className="text-4xl font-black text-black/10">02</span>
                            <div>
                                <h3 className="font-bold uppercase tracking-wider text-sm">Build Mocks</h3>
                                <p className="text-xs font-bold opacity-60">Unlimited tests. Zero cost.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center md:block">
                            <span className="text-4xl font-black text-black/10">03</span>
                            <div>
                                <h3 className="font-bold uppercase tracking-wider text-sm">Go Live</h3>
                                <p className="text-xs font-bold opacity-60">We manage it. You earn.</p>
                            </div>
                        </div>
                    </div>

                    {/* Highlight Strip */}
                    <div className="bg-black text-white p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(255,208,47,1)] mt-2">
                        <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest text-primary mb-2">
                            <span>Free Entry</span>
                            <span>•</span>
                            <span>Unlimited Mocks</span>
                            <span>•</span>
                            <span>Free Guidance</span>
                        </div>
                        <p className="font-bold text-lg leading-tight">
                            No setup fee. No tech headache. If you can teach, you can launch.
                            <span className="block mt-2 text-sm opacity-70 font-normal normal-case">
                                Monetize with a simple revenue-share model — you earn when your students buy.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Right Column: Glassmorphism Card (Preserving Logic) */}
                <div className="w-full max-w-md mx-auto relative z-10 backdrop-blur-xl bg-white/60 border-2 border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-3xl p-6 md:p-10 flex flex-col gap-6">
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
        </div>
    );
}
