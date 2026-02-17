"use client";

import { useState } from "react";

export const Proctoring = () => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <section className="py-24 bg-zinc-50 border-t-4 border-black relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-black uppercase tracking-tighter italic leading-[0.9]">
                        Train In A <br />
                        <span className="text-primary">Zero-Distraction Zone</span>
                    </h2>
                    <p className="text-black font-bold uppercase tracking-widest text-xs opacity-60 mb-12">
                        We replicate the strict NTA environment so you don't panic on exam day.
                    </p>

                    <div className="max-w-xl mx-auto mb-20">
                        <div className="bg-white border-4 border-black rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center relative">
                            {/* Header */}
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b-2 border-black/10 pb-4 inline-block">
                                Simulation Mode Active
                            </h3>

                            {/* Status Chips */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 w-full max-w-4xl mx-auto">
                                {/* Screen Locked (Active) */}
                                <div className="relative h-14 w-full group z-0 hover:z-50 focus-within:z-50" tabIndex={0}>
                                    <div className="absolute inset-0 w-full flex items-center justify-center gap-2 bg-black text-white px-4 rounded-lg border-2 border-black shadow-md transition-opacity duration-200 group-hover:opacity-0">
                                        <svg className="w-5 h-5 text-[#FFD02F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span className="font-bold uppercase text-xs tracking-widest min-w-0 truncate">Exam Lock</span>
                                    </div>
                                    <div className="absolute left-0 top-0 h-14 min-w-full w-max max-w-[280px] flex items-center justify-center gap-2 bg-black text-white px-4 rounded-lg border-2 border-black shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-[1.03] group-hover:pointer-events-auto transition-all duration-200 z-50">
                                        <svg className="w-5 h-5 text-[#FFD02F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span className="font-bold uppercase text-xs tracking-widest whitespace-nowrap">Exam Lock Active</span>
                                    </div>
                                </div>

                                {/* Activity Monitored (Armed) */}
                                <div className="relative h-14 w-full group z-0 hover:z-50 focus-within:z-50" tabIndex={0}>
                                    <div className="absolute inset-0 w-full flex items-center justify-center gap-2 bg-white text-black px-4 rounded-lg border-2 border-black shadow-sm transition-opacity duration-200 group-hover:opacity-0">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="font-bold uppercase text-xs tracking-widest min-w-0 truncate">Focus Mode</span>
                                    </div>
                                    <div className="absolute left-0 top-0 h-14 min-w-full w-max max-w-[280px] flex items-center justify-center gap-2 bg-white text-black px-4 rounded-lg border-2 border-black shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-[1.03] group-hover:pointer-events-auto transition-all duration-200 z-50">
                                        <svg className="w-5 h-5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="font-black uppercase text-xs tracking-widest whitespace-nowrap">Focus Mode On</span>
                                    </div>
                                </div>

                                {/* Content Protected (Armed) */}
                                <div className="relative h-14 w-full md:col-span-2 lg:col-span-1 group z-0 hover:z-50 focus-within:z-50" tabIndex={0}>
                                    <div className="absolute inset-0 w-full flex items-center justify-center gap-2 bg-white text-black px-4 rounded-lg border-2 border-black shadow-sm transition-opacity duration-200 group-hover:opacity-0">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-bold uppercase text-xs tracking-widest min-w-0 truncate">NTA Pattern</span>
                                    </div>
                                    <div className="absolute right-0 top-0 h-14 min-w-full w-max max-w-[280px] flex items-center justify-center gap-2 bg-white text-black px-4 rounded-lg border-2 border-black shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-[1.03] group-hover:pointer-events-auto transition-all duration-200 z-50">
                                        <svg className="w-5 h-5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-black uppercase text-xs tracking-widest whitespace-nowrap">NTA Verified</span>
                                    </div>
                                </div>
                            </div>

                            {/* Enforcement Text */}
                            <p className="font-bold text-sm md:text-base leading-relaxed opacity-80 max-w-lg mx-auto">
                                The closest you can get to the actual exam. <br />
                                <span className="text-black font-black underline decoration-2 decoration-[#FFD02F]">Full-screen, timed, and distraction-free.</span>
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
                            <h3 className="text-sm font-black uppercase tracking-widest">Interactive Preview</h3>
                        </div>
                        <p className="text-center text-xs font-bold uppercase tracking-widest opacity-60 mb-6 relative z-10">
                            Click below to see the interface
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
                    </div>
                </div>
            </div>
        </section>
    );
};
