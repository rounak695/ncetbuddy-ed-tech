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
                        Exam Rules, <br />
                        <span className="text-primary">Enforced by System</span>
                    </h2>
                    <p className="text-black font-bold uppercase tracking-widest text-xs opacity-60 mb-12">
                        Once the exam starts, the system takes control. No exceptions.
                    </p>

                    <div className="max-w-xl mx-auto mb-20">
                        <div className="bg-white border-4 border-black rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center relative">
                            {/* Header */}
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b-2 border-black/10 pb-4 inline-block">
                                Strict Mode Status
                            </h3>

                            {/* Status Chips */}
                            {/* Status Chips */}
                            {/* Status Chips */}
                            {/* Status Chips */}
                            {/* Status Chips */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 w-full max-w-4xl mx-auto">
                                {/* Screen Locked (Active) */}
                                <div className="relative h-14 w-full group z-0 hover:z-50 focus-within:z-50" tabIndex={0}>
                                    {/* Base State (Truncated) */}
                                    <div className="absolute inset-0 w-full flex items-center justify-center gap-2 bg-black text-white px-4 rounded-lg border-2 border-black shadow-md transition-opacity duration-200 group-hover:opacity-0 group-focus:opacity-0">
                                        <svg className="w-5 h-5 text-[#FFD02F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span className="font-bold uppercase text-xs tracking-widest min-w-0 truncate">Screen Locked</span>
                                    </div>
                                    {/* Hover State (Expanded Overlay) */}
                                    <div className="absolute left-0 top-0 h-14 min-w-full w-max max-w-[280px] flex items-center justify-center gap-2 bg-black text-white px-4 rounded-lg border-2 border-black shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-[1.03] group-hover:pointer-events-auto group-focus:opacity-100 group-focus:scale-[1.03] group-focus:pointer-events-auto transition-all duration-200 ease-out origin-center z-50">
                                        <svg className="w-5 h-5 text-[#FFD02F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span className="font-bold uppercase text-xs tracking-widest whitespace-nowrap">Screen Locked</span>
                                    </div>
                                </div>

                                {/* Activity Monitored (Armed) */}
                                <div className="relative h-14 w-full group z-0 hover:z-50 focus-within:z-50" tabIndex={0}>
                                    {/* Base State */}
                                    <div className="absolute inset-0 w-full flex items-center justify-center gap-2 bg-white text-black px-4 rounded-lg border-2 border-black shadow-sm transition-opacity duration-200 group-hover:opacity-0 group-focus:opacity-0">
                                        <svg className="w-5 h-5 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="font-bold uppercase text-xs tracking-widest min-w-0 truncate">Activity Monitored</span>
                                    </div>
                                    {/* Hover State */}
                                    <div className="absolute left-0 top-0 h-14 min-w-full w-max max-w-[280px] flex items-center justify-center gap-2 bg-white text-black px-4 rounded-lg border-2 border-black shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-[1.03] group-hover:pointer-events-auto group-focus:opacity-100 group-focus:scale-[1.03] group-focus:pointer-events-auto transition-all duration-200 ease-out origin-center z-50">
                                        <svg className="w-5 h-5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="font-black uppercase text-xs tracking-widest whitespace-nowrap">Activity Monitored</span>
                                    </div>
                                </div>

                                {/* Content Protected (Armed) */}
                                <div className="relative h-14 w-full md:col-span-2 lg:col-span-1 group z-0 hover:z-50 focus-within:z-50" tabIndex={0}>
                                    {/* Base State */}
                                    <div className="absolute inset-0 w-full flex items-center justify-center gap-2 bg-white text-black px-4 rounded-lg border-2 border-black shadow-sm transition-opacity duration-200 group-hover:opacity-0 group-focus:opacity-0">
                                        <svg className="w-5 h-5 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                        <span className="font-bold uppercase text-xs tracking-widest min-w-0 truncate">Content Protected</span>
                                    </div>
                                    {/* Hover State */}
                                    <div className="absolute right-0 top-0 h-14 min-w-full w-max max-w-[280px] flex items-center justify-center gap-2 bg-white text-black px-4 rounded-lg border-2 border-black shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-[1.03] group-hover:pointer-events-auto group-focus:opacity-100 group-focus:scale-[1.03] group-focus:pointer-events-auto transition-all duration-200 ease-out origin-right z-50">
                                        <svg className="w-5 h-5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                        <span className="font-black uppercase text-xs tracking-widest whitespace-nowrap">Content Protected</span>
                                    </div>
                                </div>
                            </div>

                            {/* Enforcement Text */}
                            <p className="font-bold text-sm md:text-base leading-relaxed opacity-80 max-w-lg mx-auto">
                                Once the exam starts, <span className="text-black font-black underline decoration-2 decoration-[#FFD02F]">the system takes control</span>.
                                Full-screen is enforced. Tab switching is logged instantly. Copy-paste and screenshots are completely disabled.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto relative z-20">
                        {/* Anti-Gravity Overlay (Fixed Layer) */}
                        <div
                            className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ease-out ${isFocused ? 'bg-black/80 backdrop-blur-md opacity-100' : 'opacity-0 pointer-events-none'}`}
                            onClick={() => setIsFocused(false)}
                        >
                            <div
                                className={`relative w-[90vw] max-w-6xl aspect-video bg-gray-900 border-4 border-black rounded-xl shadow-2xl transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${isFocused ? 'scale-100 translate-y-0 opacity-100 rotate-0' : 'scale-75 translate-y-[100px] opacity-0 rotate-x-12'}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src="/mock_test_interface.png"
                                    alt="Secure Testing Interface"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                                <button
                                    onClick={() => setIsFocused(false)}
                                    className="absolute -top-12 right-0 text-white font-bold uppercase text-sm tracking-widest hover:text-primary transition-colors"
                                >
                                    Close Preview [ESC]
                                </button>
                            </div>
                        </div>

                        <div className="mb-8 flex items-center justify-center gap-3 relative z-10">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <h3 className="text-sm font-black uppercase tracking-widest">Live Testing Interface (Strict Mode Enabled)</h3>
                        </div>
                        <p className="text-center text-xs font-bold uppercase tracking-widest opacity-60 mb-6 relative z-10">
                            Real interface. Real pressure. Real exam discipline.
                        </p>

                        {/* Trigger Card (Original Position) */}
                        <div
                            className={`rounded-3xl border-4 border-black overflow-hidden bg-gray-900 aspect-video relative group cursor-pointer mx-auto relative z-30 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]`}
                            onClick={() => setIsFocused(true)}
                        >
                            <img
                                src="/mock_test_interface.png"
                                alt="Secure Testing Interface"
                                className={`w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity`}
                            />

                            {/* Hover Instruction Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-50">
                                <span className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    Click to Reveal
                                </span>
                            </div>
                        </div>

                        <p className="text-center text-[10px] font-bold uppercase tracking-widest opacity-40 mt-6 animate-pulse">
                            Click to experience full-screen focus mode
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
