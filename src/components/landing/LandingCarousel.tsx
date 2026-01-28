"use client";

import { useState, useEffect } from "react";
import { Hero } from "./Hero";
import { Segmentation } from "./Segmentation";
import { Features } from "./Features";
import Link from "next/link";

export const LandingCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        { component: <Hero isSlide={true} />, id: "hero", extraClass: "" },
        { component: <div className="pt-12"><Segmentation /></div>, id: "segmentation", extraClass: "" },
        { component: <div className="pt-8"><Features /></div>, id: "features", extraClass: "" }
    ];

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, slides.length]);

    return (
        <div
            className="relative min-h-[100vh] overflow-hidden bg-white flex flex-col pt-32 md:pt-48 pb-20"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            {/* Background gradients (Persistent) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            {/* Fixed Logo (Top) relative to container usually, but here strict absolute placement to match Hero */}
            <div className="absolute top-32 md:top-48 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <div className="w-24 h-24 md:w-32 md:h-32 mb-8 rounded-3xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] bg-white animate-in zoom-in duration-700 pointer-events-auto">
                    <img src="/logo.png" alt="NCET Buddy Logo" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Carousel Content Area */}
            {/* We need enough height for the tallest content. Using flex-grow to push footer buttons down */}
            <div className="relative z-10 w-full flex-grow flex items-center justify-center">
                {/* 
                   Wait, if we hide non-active slides, we lose the transition.
                   We need them visible during transition.
                   Also, `Segmentation` and `Features` contain their own <section> tags with padding.
                   We might need to strip those or handle them. 
                   They have `py-20` etc.
                   
                   Let's use a simpler approach for the MV: 
                   Just one active component rendered, but with a key-based animation presence?
                   React state transition.
                   
                   Better manual CSS transition:
                   All rendered within a grid cell (stacking).
                   Active one is z-10, Others z-0 opacity-0.
                */}
                <div className="relative w-full">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`w-full transition-all duration-700 ease-in-out
                            ${index === currentSlide ? 'opacity-100 translate-y-0 relative z-10' : 'opacity-0 absolute top-0 left-0 -translate-y-[50px] z-0 pointer-events-none'}
                            `}
                        >
                            {slide.component}
                        </div>
                    ))}
                </div>
            </div>

            {/* Persistent CTA Buttons */}
            <div className="relative z-50 flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 pb-10">
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
        </div>
    );
};
