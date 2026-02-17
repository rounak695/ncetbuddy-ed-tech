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
                        Most platforms help you practice. NCET Buddy helps you win.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mb-20 space-y-8">
                    {/* Contrast Strip 1 */}
                    <div className="border-l-4 border-black pl-6 md:pl-8 py-2">
                        <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-3">
                            AI-Powered Strategy — <span className="text-primary">Not Just Questions</span>
                        </h3>
                        <p className="text-lg md:text-xl font-bold text-black mb-2 leading-tight">
                            Our Smart Planner doesn't just list tests; it tells you exactly what to solve today to improve your weakest areas.
                        </p>
                        <p className="text-black/50 font-medium text-sm md:text-base italic">
                            Unlike typical apps that leave you guessing what to study next.
                        </p>
                    </div>

                    {/* Contrast Strip 2 */}
                    <div className="border-l-4 border-black pl-6 md:pl-8 py-2">
                        <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-3">
                            Real Exam Temperament — <span className="text-primary">Strict NTA Interface</span>
                        </h3>
                        <p className="text-lg md:text-xl font-bold text-black mb-2 leading-tight">
                            We replicate the exact NTA exam environment (timers, navigation, marking scheme) to kill exam anxiety.
                        </p>
                        <p className="text-black/50 font-medium text-sm md:text-base italic">
                            Most other platforms optimize for casual mobile quizzes, not serious exam simulation.
                        </p>
                    </div>

                    {/* Contrast Strip 3 */}
                    <div className="border-l-4 border-black pl-6 md:pl-8 py-2">
                        <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-3">
                            Community & Support — <span className="text-primary">Never Study Alone</span>
                        </h3>
                        <p className="text-lg md:text-xl font-bold text-black mb-2 leading-tight">
                            Get your doubts resolved by peers and toppers in our dedicated Doubt Forum.
                        </p>
                        <p className="text-black/50 font-medium text-sm md:text-base italic">
                            Don't struggle in isolation. Learn from the best.
                        </p>
                    </div>

                    {/* Contrast Strip 4 */}
                    <div className="border-l-4 border-black pl-6 md:pl-8 py-2">
                        <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-3">
                            Deep Insights — <span className="text-primary">Actionable Data</span>
                        </h3>
                        <p className="text-lg md:text-xl font-bold text-black mb-2 leading-tight">
                            Understand your accuracy, time-spent per question, and subject-wise strength with our advanced analytics.
                        </p>
                        <p className="text-black/50 font-medium text-sm md:text-base italic">
                            Move beyond simple scores. Know why you lost marks.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
