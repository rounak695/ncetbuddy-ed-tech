"use client";

import { useState } from "react";

export const Proctoring = () => {
    const [isFocused, setIsFocused] = useState(false);
    const features = [
        {
            title: "Tab Switch Detection",
            description: "Automatically detects when a student switches tabs or windows.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )
        },
        {
            title: "Full-Screen Lock",
            description: "Forces the test to remain in full-screen throughout the exam session.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
            )
        },
        {
            title: "Auto-Suspend",
            description: "Exam is automatically paused or terminated after repeated violations.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        {
            title: "Anti-Copy Protection",
            description: "Disables text selection, copy, paste, and screenshots.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        },
        {
            title: "Randomized Questions",
            description: "Each student receives a uniquely sequenced paper to prevent collusion.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-24 bg-zinc-50 border-t-4 border-black relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-black uppercase tracking-tighter italic leading-[0.9]">
                        NTA-Grade <br />
                        <span className="text-primary">Secure Proctoring</span>
                    </h2>
                    <p className="text-black font-bold uppercase tracking-widest text-xs opacity-60 mb-12">
                        Strict Mode ensures discipline, fairness, and exam-hall like seriousness
                    </p>

                    <div className="max-w-3xl mx-auto bg-white border-4 border-black rounded-3xl p-8 md:p-12 mb-20 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                            {features.map((feature, index) => (
                                <div key={index} className="flex flex-col gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-black text-primary flex items-center justify-center border-2 border-black flex-shrink-0">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase italic mb-2">{feature.title}</h3>
                                        <p className="text-sm font-medium opacity-70 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-12 border-t-2 border-dashed border-gray-300">
                            <h3 className="text-xl font-black uppercase italic mb-4">Why Strict Mode Matters</h3>
                            <p className="text-base font-medium opacity-80 leading-relaxed max-w-2xl mx-auto">
                                NCET Buddy’s Integrity Engine is designed to closely simulate official NTA exam environments.
                                This reduces malpractice, builds student discipline, and gives educators confidence to conduct high-stakes mock tests online.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto relative z-20">
                        {/* Backdrop Blur Overlay */}
                        <div
                            className={`fixed inset-0 bg-white/10 backdrop-blur-sm z-40 transition-all duration-300 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'}`}
                            aria-hidden="true"
                        />

                        <div className="mb-8 flex items-center justify-center gap-3 relative z-10">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <h3 className="text-sm font-black uppercase tracking-widest">Live Testing Interface (Strict Mode Enabled)</h3>
                        </div>
                        <p className="text-center text-xs font-bold uppercase tracking-widest opacity-60 mb-6 relative z-10">
                            Real interface. Real pressure. Real exam discipline.
                        </p>

                        <div
                            className={`rounded-3xl border-4 border-black overflow-hidden bg-gray-900 aspect-video relative group cursor-pointer mx-auto relative z-30 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
                            onMouseEnter={() => setIsFocused(true)}
                            onMouseLeave={() => setIsFocused(false)}
                            onClick={() => setIsFocused(!isFocused)}
                        >
                            <img
                                src="/mock_test_interface.png"
                                alt="Secure Testing Interface"
                                className={`w-[110%] h-full object-cover transition-transform duration-500 ease-in-out ${isFocused ? 'translate-x-[-15%]' : 'translate-x-[-5%]'} max-w-none`}
                            />

                            {/* Overlay Badge */}
                            <div className="absolute top-6 right-6 px-4 py-2 bg-red-500 border-2 border-black text-white font-black text-xs uppercase tracking-widest rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 z-40">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Monitoring Active
                            </div>
                        </div>

                        <p className="text-center text-[10px] font-bold uppercase tracking-widest opacity-40 mt-6 animate-pulse">
                            Hover or tap to view full exam interface
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
