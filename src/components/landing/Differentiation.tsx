export const Differentiation = () => {
    return (
        <section className="py-24 bg-white border-t-4 border-black relative">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-black uppercase tracking-tighter italic leading-[0.9]">
                        Why NCET Buddy Is <br />
                        <span className="text-primary">Fundamentally Different</span>
                    </h2>
                    <p className="text-black font-bold max-w-2xl mx-auto uppercase tracking-widest text-xs opacity-60">
                        Most platforms help students practice. NCET Buddy helps educators run real exams at scale.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mb-20">
                    <div className="overflow-x-auto bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-4 border-black bg-gray-50">
                                    <th className="p-6 text-black font-black uppercase tracking-wide text-sm md:text-base w-1/3">Feature</th>
                                    <th className="p-6 text-black font-black uppercase tracking-wide text-sm md:text-base bg-[#FFD02F]/20 border-x-4 border-black text-center w-1/3">NCET Buddy</th>
                                    <th className="p-6 text-black font-black uppercase tracking-wide text-sm md:text-base text-center w-1/3 opacity-50">Typical Prep App</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black">
                                {[
                                    { feature: "Built for educators", buddy: true, other: false },
                                    { feature: "Branded exams (educator identity)", buddy: true, other: false },
                                    { feature: "Real exam environment (NTA-like)", buddy: true, other: false },
                                    { feature: "Proctoring & attempt control", buddy: true, other: false },
                                    { feature: "Revenue sharing with teachers", buddy: true, other: false },
                                    { feature: "Handles traffic spikes during exams", buddy: true, other: false },
                                    { feature: "Used as infrastructure by other brands", buddy: true, other: false },
                                    { feature: "Focuses on exam delivery, not just practice", buddy: true, other: false }
                                ].map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 md:p-6 font-bold text-sm md:text-base text-black border-r-4 border-black">{row.feature}</td>
                                        <td className="p-4 md:p-6 text-center border-r-4 border-black bg-[#FFD02F]/10">
                                            {row.buddy ? (
                                                <div className="w-8 h-8 rounded-full bg-black text-[#FFD02F] flex items-center justify-center mx-auto border-2 border-black">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <span className="text-red-500 font-black text-xl">❌</span>
                                            )}
                                        </td>
                                        <td className="p-4 md:p-6 text-center opacity-50">
                                            {row.other ? (
                                                <div className="w-8 h-8 rounded-full bg-black text-[#FFD02F] flex items-center justify-center mx-auto border-2 border-black">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mx-auto border-2 border-gray-400">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-center">
                    <div className="bg-zinc-50 border-4 border-black rounded-3xl p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-2xl font-black mb-6 text-black uppercase italic">Think of it this way</h3>
                        <ul className="space-y-4">
                            {[
                                "A prep app helps students practice questions",
                                "NCET Buddy helps educators conduct exams",
                                "Prep apps build audiences",
                                "NCET Buddy builds exam systems",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-black rounded-full" />
                                    <span className="text-black font-bold text-sm md:text-base opacity-80">{item}</span>
                                </li>
                            ))}
                            <li className="flex items-start gap-3 pt-2">
                                <div className="w-2 h-2 bg-black rounded-full mt-2" />
                                <span className="text-black font-bold text-sm md:text-base opacity-80 italic">
                                    Prep apps ask: "How many questions did you solve?" <br />
                                    <span className="text-primary not-italic">NCET Buddy asks: "Can this exam run smoothly for 10,000 students at once?"</span>
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div className="flex flex-col gap-6">
                            {[
                                { label: "Designed for high-stakes exam workflows", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                                { label: "Built to support multiple educator brands", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                                { label: "Engineered with exam-day reliability as the core priority", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 border-2 border-dashed border-black/20 rounded-xl bg-white/50">
                                    <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-sm uppercase tracking-wide opacity-70">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
