"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export const LandingCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);

    const slides = [
        {
            id: "launch",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 max-w-5xl mx-auto text-center pt-20 pb-40">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-black uppercase">
                        Launch Your <br className="hidden md:block" />
                        <span className="bg-black text-primary px-4 py-2 italic transform -rotate-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-2 hover:scale-105 transition-transform">
                            Test Series
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-black font-bold max-w-2xl mx-auto leading-tight opacity-80">
                        Launch your own branded test series. <br className="hidden md:block" />
                        NTA-style mock tests, proctoring, analytics, and monetization — ready to use.
                    </p>
                </div>
            )
        },
        {
            id: "trust",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 w-full pt-28 pb-40">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-8 md:mb-12 text-center text-black uppercase italic leading-[0.9] max-w-6xl">
                        Built for Educators. Trusted by Students.
                    </h1>

                    <div className="flex flex-col md:flex-row gap-6 lg:gap-10 w-full max-w-5xl mx-auto items-stretch">
                        {/* Educators Card */}
                        <div className="flex-1 bg-primary border-4 border-black rounded-3xl p-6 md:p-8 flex flex-col justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300">
                            <h3 className="text-2xl md:text-3xl font-black uppercase mb-6 text-black tracking-tight">For Educators</h3>
                            <ul className="space-y-4 text-left">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-black text-base md:text-lg leading-tight">Launch your own branded test series</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-black text-base md:text-lg leading-tight">No technical setup required</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-black text-base md:text-lg leading-tight">Focus on teaching, we handle infrastructure</span>
                                </li>
                            </ul>
                        </div>

                        {/* Students Card */}
                        <div className="flex-1 bg-white border-4 border-black rounded-3xl p-6 md:p-8 flex flex-col justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-300">
                            <h3 className="text-2xl md:text-3xl font-black uppercase mb-6 text-black tracking-tight">For Students</h3>
                            <ul className="space-y-4 text-left">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-black text-base md:text-lg leading-tight">NCET-pattern mock tests</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-black text-base md:text-lg leading-tight">Real exam-like environment</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-black text-base md:text-lg leading-tight">Performance analytics</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "empower",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 w-full pt-20 pb-40">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 text-center text-black uppercase italic leading-[0.9]">
                        Empower Your Teaching
                    </h1>
                    <p className="text-xs md:text-sm font-bold text-black opacity-60 uppercase tracking-[0.2em] mb-8 md:mb-12 text-center max-w-3xl">
                        The complete infrastructure for launching your own test series
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full max-w-7xl mx-auto px-2">
                        {/* Card 1: Proctoring & Scale */}
                        <div className="bg-white border-4 border-black rounded-3xl p-6 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300 h-full">
                            <div className="w-12 h-12 bg-black rounded-2xl mb-5 flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-black uppercase italic mb-3 leading-none">Proctoring & Scale</h3>
                            <p className="text-sm font-bold opacity-60 leading-relaxed">
                                Plug-and-play NTA-style testing environment. Handle high traffic during live exams with zero downtime.
                            </p>
                        </div>

                        {/* Card 2: Zero Tech Hassle */}
                        <div className="bg-white border-4 border-black rounded-3xl p-6 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300 h-full">
                            <div className="w-12 h-12 bg-black rounded-2xl mb-5 flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-black uppercase italic mb-3 leading-none">Zero Tech Hassle</h3>
                            <p className="text-sm font-bold opacity-60 leading-relaxed">
                                No servers to manage, no code to write. We handle all infrastructure so you can focus purely on teaching.
                            </p>
                        </div>

                        {/* Card 3: Monetization */}
                        <div className="bg-white border-4 border-black rounded-3xl p-6 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300 h-full">
                            <div className="w-12 h-12 bg-black rounded-2xl mb-5 flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-black uppercase italic mb-3 leading-none">Monetization</h3>
                            <p className="text-sm font-bold opacity-60 leading-relaxed">
                                Built-in revenue sharing and performance dashboards. Track your test series sales and student engagement.
                            </p>
                        </div>

                        {/* Card 4: For Students */}
                        <div className="bg-white border-4 border-black rounded-3xl p-6 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300 h-full">
                            <div className="w-12 h-12 bg-black rounded-2xl mb-5 flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl font-black uppercase italic mb-3 leading-none">For Students</h3>
                            <p className="text-sm font-bold opacity-60 leading-relaxed">
                                Students get real exam experience, detailed analytics, and access to top-tier content from partner educators.
                            </p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [isPaused, slides.length]);

    // Swipe handling
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        setIsPaused(false);
        touchEndY.current = e.changedTouches[0].clientY;
        const distance = touchStartY.current - touchEndY.current;

        if (Math.abs(distance) > 50) {
            if (distance > 0) {
                // Swipe Up -> Next Slide
                setActiveIndex((prev) => (prev + 1) % slides.length);
            } else {
                // Swipe Down -> Prev Slide
                setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
            }
        }
    };

    return (
        <section
            className="relative h-[90vh] min-h-[700px] bg-white flex flex-col overflow-hidden border-b-4 border-black"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background gradients (Persistent) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            {/* Persistent Top Elements */}
            <div className="absolute top-8 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
                {/* Logo */}
                <div className="w-24 h-24 md:w-28 md:h-28 mb-6 rounded-3xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] bg-white pointer-events-auto hover:scale-105 transition-transform duration-300">
                    <img src="/logo.png" alt="NCET Buddy Logo" className="w-full h-full object-cover" />
                </div>

                {/* Live Badge */}
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary border-2 border-black text-xs font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="flex h-3 w-3 rounded-full bg-white border-2 border-black animate-pulse" />
                    NCET Buddy 2.0 is live
                </div>
            </div>

            {/* Carousel Content */}
            <div
                className="relative z-10 w-full h-full text-black"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out flex items-center justify-center`}
                        style={{
                            transform: `translateY(${(index - activeIndex) * 100}%)`,
                            opacity: Math.abs(index - activeIndex) <= 1 ? 1 : 0 // Optimization
                        }}
                    >
                        {slide.content}
                    </div>
                ))}
            </div>

            {/* Persistent CTA Buttons (Bottom) */}
            <div className="absolute bottom-12 left-0 right-0 z-50 flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
                <Link
                    href="/partner"
                    className="w-full sm:w-auto text-center px-8 py-4 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:-translate-y-1 transition-all border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                >
                    Educator Login
                </Link>
                <Link
                    href="/login"
                    className="w-full sm:w-auto text-center px-8 py-4 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black hover:-translate-y-1 transition-all border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                >
                    Student Login
                </Link>
            </div>

            {/* Pagination Indicators (Optional but good for UX) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40 hidden md:flex">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-3 h-3 rounded-full border-2 border-black transition-all ${index === activeIndex ? "bg-primary scale-125" : "bg-white hover:bg-gray-200"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
