import Link from "next/link";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary border-2 border-black text-xs font-black uppercase tracking-widest text-black mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="flex h-3 w-3 rounded-full bg-white border-2 border-black animate-pulse" />
                    NCET Buddy 2.0 is live
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9]">
                    MASTER YOUR <br />
                    <span className="bg-black text-primary px-4 py-2 italic transform -rotate-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        JOURNEY
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-black font-bold max-w-2xl mx-auto mb-16 leading-tight opacity-70">
                    The all-in-one platform for NCET aspirants. Access curated notes,
                    mock tests, and expert mentorship to supercharge your success.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link
                        href="/login"
                        className="px-10 py-5 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:-translate-y-2 transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                    >
                        GET STARTED
                    </Link>
                    <Link
                        href="#features"
                        className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black hover:-translate-y-2 transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                    >
                        LEARN MORE
                    </Link>
                </div>
            </div>
        </section>
    );
}
