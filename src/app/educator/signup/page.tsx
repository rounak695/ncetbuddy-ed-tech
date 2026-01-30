"use client";

import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite-educator";
import { ID, OAuthProvider } from "appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EducatorSignup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                await account.get();
                // If get() succeeds, user is already logged in. Redirect to dashboard.
                router.replace("/educator/dashboard");
            } catch {
                // No session, allow signup.
            }
        };
        checkSession();
    }, [router]);

    const handleGoogleSignup = async () => {
        try {
            await account.deleteSession("current").catch(() => { });
            account.createOAuth2Session(
                OAuthProvider.Google,
                `${window.location.origin}/educator/dashboard`,
                `${window.location.origin}/educator/signup`
            );
        } catch (err) {
            console.error(err);
            setError("Failed to initialize Google signup");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // 1. Force logout stale sessions
            await account.deleteSession("current").catch(() => { });

            // 2. Create Account
            await account.create(ID.unique(), email, password, name);

            // 3. Login immediately
            await account.createEmailPasswordSession(email, password);

            // 4. Set Role Preference
            try {
                await account.updatePrefs({ role: "educator" });
            } catch (prefError) {
                console.warn("Failed to set role pref", prefError);
            }

            // 5. Redirect
            router.push("/educator/dashboard");
        } catch (err) {
            console.error(err);
            setError((err as any).message || "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 lg:p-12">
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-start">

                {/* Left Column: Marketing Story (Reused from Login for consistency) */}
                <div className="flex flex-col gap-8 text-black pb-12 pt-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9]">
                            Start your <span className="bg-primary px-1">teaching empire</span> today.
                        </h1>
                        <h2 className="text-xl md:text-2xl font-bold opacity-70">
                            Zero setup fees. Unlimited growth. Pure teaching.
                        </h2>
                    </div>

                    <div className="space-y-6 text-lg font-medium opacity-80 leading-relaxed max-w-2xl">
                        <p>
                            Join thousands of educators who are launching their own branded exam portals.
                            Get enterprise-grade infrastructure without the enterprise price tag.
                        </p>
                    </div>

                    <div className="bg-black text-white py-5 px-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] mt-2">
                        <div className="flex flex-wrap gap-4 text-[11px] font-bold uppercase tracking-wider text-primary/90 mb-2">
                            <span>Instant Activation</span>
                            <span>•</span>
                            <span>Secure Proctoring</span>
                            <span>•</span>
                            <span>Global Payments</span>
                        </div>
                        <p className="font-bold text-xl leading-relaxed max-w-lg">
                            Create your free account in 30 seconds.
                            <span className="block mt-4 text-sm opacity-50 font-normal normal-case">
                                No credit card required. Cancel anytime.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Right Column: Signup Card */}
                <div className="w-full max-w-md mx-auto relative z-10 backdrop-blur-xl bg-white/60 border-2 border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-3xl p-6 md:p-10 flex flex-col gap-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Create Account</h2>
                        <p className="font-bold text-sm opacity-60">Join NCET Buddy as an Educator</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-2 rounded-xl text-sm font-bold animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleSignup}
                        className="w-full h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:-translate-y-0.5 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none font-bold"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Sign up with Google
                    </button>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t-2 border-black/10"></div>
                        <span className="flex-shrink-0 mx-4 font-bold text-xs opacity-40 uppercase">Or sign up with email</span>
                        <div className="flex-grow border-t-2 border-black/10"></div>
                    </div>

                    <form onSubmit={handleSignup} className="flex flex-col gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-wider ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 bg-white border-2 border-black rounded-xl px-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                placeholder="Your Name"
                            />
                        </div>

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
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 bg-white border-2 border-black rounded-xl px-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                placeholder="Min 8 chars"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary hover:text-black hover:-translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-none mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating Account..." : "Create Free Account"}
                        </button>
                    </form>

                    <div className="text-center space-y-4 pt-2">
                        <p className="text-xs font-bold">
                            Already have an account?{" "}
                            <Link href="/educator/login" className="underline hover:text-primary">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
