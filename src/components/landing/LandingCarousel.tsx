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
            id: "ace-exam",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 max-w-5xl mx-auto text-center pt-28 pb-32">
                    <div className="inline-block px-4 py-1.5 bg-white border-2 border-black rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce text-black">
                        🚀 #1 Platform for NCET Aspirants
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-black uppercase">
                        Crack NCET <br className="hidden md:block" />
                        <span className="bg-black text-primary px-4 py-2 italic transform -rotate-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-2 hover:scale-105 transition-transform">
                            With Confidence
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-black font-bold max-w-2xl mx-auto leading-tight opacity-80">
                        The smartest way to prepare. <br className="hidden md:block" />
                        AI Study Planner, Real NTA Mocks, and a supportive community.
                    </p>
                </div>
            )
        },
        {
            id: "ai-roadmap",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 max-w-5xl mx-auto text-center pt-28 pb-32">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-black uppercase">
                        Your Personal <br className="hidden md:block" />
                        <span className="bg-white text-black border-4 border-black px-4 py-2 italic transform rotate-1 inline-block shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] mt-2">
                            Success Roadmap
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-black font-bold max-w-2xl mx-auto leading-tight opacity-80">
                        Stop guessing what to study. Our AI identifies your weak areas and creates a daily plan just for you.
                    </p>
                </div>
            )
        },
        {
            id: "community",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 max-w-5xl mx-auto text-center pt-28 pb-32">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-black uppercase">
                        Never Prepare <br className="hidden md:block" />
                        <span className="bg-primary text-black px-4 py-2 italic transform -rotate-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-2">
                            Alone
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-black font-bold max-w-2xl mx-auto leading-tight opacity-80">
                        Join thousands of serious aspirants. Solve doubts in our Forum and compete on the Leaderboard.
                    </p>
                </div>
            )
        }
    ];

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 8000);

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
                        className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out flex items-center justify-center ${index === activeIndex
                                ? "opacity-100 translate-x-0"
                                : index < activeIndex
                                    ? "opacity-0 -translate-x-full"
                                    : "opacity-0 translate-x-full"
                            }`}
                        style={{
                            // Override the class translation if needed for JS animation, but using classes for simplicity/performance
                            // keeping style transform for the precise touch dragging if we were implementing that deeply, 
                            // but here simplified to class switching for robustness.
                            transform: index === activeIndex ? "translateX(0)" : index < activeIndex ? "translateX(-100%)" : "translateX(100%)"
                        }}
                    >
                        {slide.content}
                    </div>
                ))}
            </div>

            {/* Persistent CTA Buttons (Bottom) */}
            <div className="absolute bottom-12 left-0 right-0 z-50 flex flex-col items-center gap-4 px-4">
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
                    <Link
                        href="/login"
                        className="w-full sm:w-auto text-center px-10 py-5 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:-translate-y-1 transition-all border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none bg-[#FFD02F] text-lg"
                    >
                        Start Practicing 🚀
                    </Link>
                    <Link
                        href="/educator/login"
                        className="w-full sm:w-auto text-center px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-gray-900 hover:text-white hover:-translate-y-1 transition-all border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none text-lg"
                    >
                        Educator Login
                    </Link>
                </div>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 hidden md:flex">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-4 h-4 rounded-full border-2 border-black transition-all duration-300 ${index === activeIndex ? "bg-primary scale-125 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-gray-100"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
