"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export const LandingCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const slides = [
        {
            id: "launch",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 max-w-5xl mx-auto text-center pt-28 pb-32">
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
                <div className="w-full h-full flex items-center justify-center relative pt-40 pb-36 px-4">
                    <img
                        src="/slide2.png"
                        alt="Built for Educators. Trusted by Students."
                        className="w-full h-full object-contain"
                    />
                </div>
            )
        },
        {
            id: "empower",
            content: (
                <div className="w-full h-full flex items-center justify-center relative pt-40 pb-36 px-4">
                    <img
                        src="/slide3.png"
                        alt="Empower Your Teaching"
                        className="w-full h-full object-contain"
                    />
                </div>
            )
        }
    ];

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 12000);

        return () => clearInterval(interval);
    }, [isPaused, slides.length]);

    // Swipe handling
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        setIsPaused(false);
        touchEndX.current = e.changedTouches[0].clientX;
        const distance = touchStartX.current - touchEndX.current;

        if (Math.abs(distance) > 50) {
            if (distance > 0) {
                // Swipe Left -> Next Slide
                setActiveIndex((prev) => (prev + 1) % slides.length);
            } else {
                // Swipe Right -> Prev Slide
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
                            transform: `translateX(${(index - activeIndex) * 100}%)`,
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
