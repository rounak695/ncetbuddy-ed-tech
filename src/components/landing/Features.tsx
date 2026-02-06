export const Features = () => {
    const features = [
        {
            title: "Proctoring & Scale",
            description: "Plug-and-play NTA-style testing environment. Handle high traffic during live exams with zero downtime.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-blue-500/10 text-blue-400"
        },
        {
            title: "Zero Tech Hassle",
            description: "No servers to manage, no code to write. We handle all infrastructure so you can focus purely on teaching.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            color: "bg-purple-500/10 text-purple-400"
        },
        {
            title: "Monetization",
            description: "Built-in revenue sharing and performance dashboards. Track your test series sales and student engagement.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "bg-green-500/10 text-green-400"
        },
        {
            title: "For Students",
            description: "Students get real exam experience, detailed analytics, and access to top-tier content.",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            color: "bg-orange-500/10 text-orange-400"
        }
    ];

    return (
        <section id="features" className="py-24 bg-white relative">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-black uppercase tracking-tighter italic">Empower Your Teaching</h2>
                    <p className="text-black font-bold opacity-60 max-w-2xl mx-auto uppercase tracking-widest text-xs">
                        The complete infrastructure for launching your own test series
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white border-4 border-black rounded-3xl p-8 hover:shadow-[12px_12px_0px_0px_rgba(255,208,47,1)] transition-all duration-300 hover:-translate-y-2 group">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-black text-primary border-2 border-black group-hover:bg-primary group-hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-black uppercase italic leading-none">{feature.title}</h3>
                            <p className="text-black font-bold opacity-60 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
