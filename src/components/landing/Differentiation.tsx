"use client";

import { motion } from "framer-motion";

export const Differentiation = () => {
    const features = [
        {
            title: "AI-Powered Strategy",
            description: "Doesn't just list tests; tells you exactly what to solve today based on your weak areas.",
            icon: "🧠",
        },
        {
            title: "Real Exam Temperament",
            description: "Replicates the exact interface, timers, and pressure to kill exam anxiety.",
            icon: "🖥️",
        },
        {
            title: "Community & Support",
            description: "Don't struggle alone. Get doubts resolved by peers and toppers instantly.",
            icon: "🤝",
        },
        {
            title: "Deep Insights",
            description: "Understand your accuracy, time-spent, and subject strengths with precision.",
            icon: "📊",
        }
    ];

    return (
        <section className="py-24 bg-white border-t-4 border-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 relative z-20">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-black uppercase tracking-tighter italic leading-[0.9]">
                        Why NCET Buddy Is <br />
                        <span className="text-primary bg-black px-2 mx-1 shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] transform -rotate-1 inline-block">Fundamentally Different</span>
                    </h2>
                    <p className="text-black font-bold max-w-2xl mx-auto uppercase tracking-widest text-xs opacity-60">
                        Most platforms help you practice. NCET Buddy helps you win.
                    </p>
                </div>

                {/* 
                    Responsive System Layout 
                */}
                <div className="relative w-full max-w-6xl mx-auto h-[950px] lg:h-[700px]">

                    {/* CENTRAL CORE - Sticky Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative w-40 h-40 md:w-56 md:h-56 bg-black rounded-full border-4 border-primary flex flex-col items-center justify-center text-center p-4 shadow-[12px_12px_0px_0px_rgba(255,208,47,1)] hover:scale-105 transition-transform duration-300 z-30">
                                <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping opacity-20" />

                                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl mb-3 flex items-center justify-center text-xl md:text-2xl border-2 border-white shadow-inner">
                                    🚀
                                </div>
                                <h3 className="text-white font-black text-sm md:text-xl uppercase italic tracking-tighter leading-none mb-1">
                                    The NCET <br /> <span className="text-primary">Advantage</span>
                                </h3>
                            </div>
                        </motion.div>
                    </div>

                    {/* SVG Connector Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                        {/* Desktop Connections - Hidden on Mobile */}
                        <g className="hidden lg:block">
                            {/* TL */}
                            <motion.path d="M50% 50% L15% 15%" fill="none" stroke="black" strokeWidth="3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
                            {/* TR */}
                            <motion.path d="M50% 50% L85% 15%" fill="none" stroke="black" strokeWidth="3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
                            {/* BL */}
                            <motion.path d="M50% 50% L15% 85%" fill="none" stroke="black" strokeWidth="3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
                            {/* BR */}
                            <motion.path d="M50% 50% L85% 85%" fill="none" stroke="black" strokeWidth="3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />

                            <circle cx="50%" cy="50%" r="35%" fill="none" stroke="black" strokeWidth="2" strokeDasharray="12 12" className="opacity-10" />
                        </g>

                        {/* Mobile Connections - Hidden on Desktop */}
                        <g className="lg:hidden">
                            {/* Vertical Line */}
                            <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="black" strokeWidth="3" strokeDasharray="8 8" className="opacity-20" />

                            {/* Connector Lines to Cards */}
                            <motion.path d="M50% 50% L50% 12%" fill="none" stroke="black" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
                            <motion.path d="M50% 50% L50% 32%" fill="none" stroke="black" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
                            <motion.path d="M50% 50% L50% 68%" fill="none" stroke="black" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
                            <motion.path d="M50% 50% L50% 88%" fill="none" stroke="black" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
                        </g>
                    </svg>

                    {/* FEATURE CARDS */}

                    {/* 1. Top Left / Top 1 */}
                    <div className="absolute w-[280px] z-20 
                        top-[5%] left-1/2 -translate-x-1/2 
                        lg:top-[5%] lg:left-[5%] lg:translate-x-0">
                        <FeatureCard feature={features[0]} align="right" />
                    </div>

                    {/* 2. Top Right / Top 2 */}
                    {/* IMPORTANT: Added lg:left-auto to prevent conflict with left-1/2 */}
                    <div className="absolute w-[280px] z-20 
                        top-[25%] left-1/2 -translate-x-1/2
                        lg:top-[5%] lg:right-[5%] lg:left-auto lg:translate-x-0">
                        <FeatureCard feature={features[1]} align="left" />
                    </div>

                    {/* 3. Bottom Left / Bottom 1 */}
                    <div className="absolute w-[280px] z-20 
                        bottom-[25%] left-1/2 -translate-x-1/2
                        lg:bottom-[5%] lg:left-[5%] lg:translate-x-0">
                        <FeatureCard feature={features[2]} align="right" />
                    </div>

                    {/* 4. Bottom Right / Bottom 2 */}
                    {/* IMPORTANT: Added lg:left-auto to prevent conflict with left-1/2 */}
                    <div className="absolute w-[280px] z-20 
                        bottom-[5%] left-1/2 -translate-x-1/2
                        lg:bottom-[5%] lg:right-[5%] lg:left-auto lg:translate-x-0">
                        <FeatureCard feature={features[3]} align="left" />
                    </div>

                </div>
            </div>
        </section>
    );
};

// Feature Card Component
// Added 'align' prop to control text alignment on desktop for symmetry
const FeatureCard = ({ feature, align = "center" }: { feature: any, align?: "left" | "right" | "center" }) => {

    // Desktop Alignment Classes
    let desktopAlignClasses = "";
    if (align === "left") {
        desktopAlignClasses = "lg:items-start lg:text-left";
    } else if (align === "right") {
        desktopAlignClasses = "lg:items-end lg:text-right";
    }

    // Icon Bubble Alignment (-ml-4 for left align, -mr-4 for right align to pull it outside)
    // Actually simpler: just use flex alignment

    return (
        <motion.div
            className="group w-full max-w-sm mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <div className={`flex flex-col items-center text-center ${desktopAlignClasses} transition-all duration-300`}>

                {/* Icon Bubble */}
                <div className="relative z-20 mb-[-24px] group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-primary transition-colors">
                        {feature.icon}
                    </div>
                </div>

                {/* Text Content */}
                <div className="bg-white border-4 border-black p-6 pt-10 rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] relative z-10 w-full group-hover:-translate-y-2 transition-transform duration-300 hover:shadow-[12px_12px_0px_0px_rgba(255,208,47,1)]">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2 leading-none">
                        {feature.title}
                    </h3>
                    <p className="text-sm font-bold opacity-60 leading-relaxed">
                        {feature.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
