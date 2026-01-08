import Link from "next/link";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    NCET Buddy 2.0 is live
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                    Master Your <br />
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                        Preparation Journey
                    </span>
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                    The all-in-one platform for NCET aspirants. Access curated notes,
                    mock tests, and expert mentorship to supercharge your success.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/login"
                        className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        Get Started
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <Link
                        href="#features"
                        className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    );
}
