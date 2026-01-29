
export const Segmentation = () => {
    return (
        <section className="py-20 bg-white border-y-4 border-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 text-black uppercase tracking-tighter italic">Built for Educators. Trusted by Students.</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Educator Card */}
                    <div className="bg-[#FFD02F] border-4 border-black rounded-3xl p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1">
                        <h3 className="text-3xl font-black mb-6 text-black uppercase tracking-tight">For Educators</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-1 flex-shrink-0">
                                    <svg className="w-4 h-4 text-[#FFD02F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-black font-bold text-lg">Launch your own branded test series</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-1 flex-shrink-0">
                                    <svg className="w-4 h-4 text-[#FFD02F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-black font-bold text-lg">No technical setup required</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-1 flex-shrink-0">
                                    <svg className="w-4 h-4 text-[#FFD02F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-black font-bold text-lg">Focus on teaching, we handle infrastructure</span>
                            </li>
                        </ul>
                    </div>

                    {/* Student Card */}
                    <div className="bg-white border-4 border-black rounded-3xl p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1">
                        <h3 className="text-3xl font-black mb-6 text-black uppercase tracking-tight">For Students</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-1 flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-black font-bold text-lg">NCET-pattern mock tests</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-1 flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-black font-bold text-lg">Real exam-like environment</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center mt-1 flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-black font-bold text-lg">Performance analytics</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};
