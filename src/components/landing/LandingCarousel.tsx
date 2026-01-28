"use client";

import { useState, useEffect, useRef } from "react";
import { Hero } from "./Hero";
import { Segmentation } from "./Segmentation";
import { Features } from "./Features";
import Link from "next/link";

export const LandingCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);

    const slides = [
        { component: <Hero isSlide={true} />, id: "hero" },
        {
            component: (
                <div className="h-full flex items-center justify-center pt-32 md:pt-48">
                    <Segmentation />
                </div>
            ),
            id: "segmentation"
        },
        {
            component: (
                <div className="h-full flex items-center justify-center pt-32 md:pt-48">
                    <Features />
                </div>
            ),
            id: "features"
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
        handleSwipe();
    };

    const handleSwipe = () => {
        const distance = touchStartY.current - touchEndY.current;
        const threshold = 50;

        if (Math.abs(distance) > threshold) {
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
        <div
            className="relative min-h-[100vh] bg-white flex flex-col overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background gradients (Persistent) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            {/* Fixed Logo (Outside Carousel) */}
            <div className="absolute top-32 md:top-48 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <div className="w-24 h-24 md:w-32 md:h-32 mb-8 rounded-3xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] bg-white animate-in zoom-in duration-700 pointer-events-auto">
                    <img src="/logo.png" alt="NCET Buddy Logo" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Carousel Wrapper */}
            <div
                className="relative z-10 w-full flex-grow overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="h-full flex flex-col transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateY(-${activeIndex * 100}%)`, height: '100%' }}
                >
                    {slides.map((slide) => (
                        <div
                            key={slide.id}
                            className="w-full min-h-[100vh] flex-shrink-0 relative"
                        >
                            {slide.component}
                        </div>
                    ))}
                </div>
            </div>

            {/* Persistent CTA Buttons (Outside Carousel) */}
            <div className="relative z-50 flex flex-col sm:flex-row gap-6 justify-center items-center pb-20 mt-8">
                <Link
                    href="/partner"
                    className="px-10 py-5 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:-translate-y-2 transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                >
                    Educator Login
                </Link>
                <Link
                    href="/login"
                    className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black hover:-translate-y-2 transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                >
                    Student Login
                </Link>
            </div>

            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary border-2 border-black text-xs font-black uppercase tracking-widest text-black absolute top-[280px] md:top-[350px] left-1/2 -translate-x-1/2 z-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-none">
                <span className="flex h-3 w-3 rounded-full bg-white border-2 border-black animate-pulse" />
                NCET Buddy 2.0 is live
            </div>
        </div>
    );
};
