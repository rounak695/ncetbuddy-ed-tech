// Utility for gradients
const gradients = {
    yellow: "from-yellow-400/20 via-orange-400/20 to-red-400/20",
    cyan: "from-cyan-400/20 via-blue-400/20 to-indigo-400/20",
    pink: "from-pink-400/20 via-purple-400/20 to-rose-400/20",
    green: "from-green-400/20 via-emerald-400/20 to-teal-400/20",
};

export function FormulaCard({ title, items, color }: { title: string, items: string, color: string }) {
    // Basic mapping for demo purposes. In a real app, pass a 'variant' prop instead of raw color code.
    let gradient = gradients.yellow;
    if (color === '#A0E7E5') gradient = gradients.cyan;
    if (color === '#FFAEBC') gradient = gradients.pink;
    if (color === '#B4F8C8') gradient = gradients.green;

    return (
        <div
            className={`
                group relative h-28 md:h-32 rounded-3xl p-4 md:p-5 overflow-hidden cursor-pointer
                bg-gradient-to-br ${gradient}
                border border-white/5 hover:border-white/10 transition-all duration-300
                hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1
                w-full
            `}
        >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg md:text-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                        ⚡
                    </div>
                </div>

                <div>
                    <div className="text-[10px] md:text-xs text-secondary-foreground/60 font-medium mb-1 tracking-wide uppercase opacity-70">Formula Sheet</div>
                    <div className="font-bold text-white text-base md:text-lg leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all truncate">
                        {title}
                    </div>
                    <div className="text-[10px] md:text-xs text-white/50 mt-0.5">{items}</div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-300" />
        </div>
    );
}

export function BookCard({ title, subtitle, image }: { title: string, subtitle: string, image?: string }) {
    return (
        <div className="group flex flex-col gap-3 md:gap-4 cursor-pointer min-w-[130px] md:w-[160px] snap-center">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xl shadow-black/40 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:-translate-y-2">
                {/* Card Background / Cover */}
                <div className="absolute inset-0 bg-neutral-900 border border-white/10 group-hover:border-white/20 transition-colors">
                    {/* Decorative Spine Effect */}
                    <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-white/5 h-full" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        {image ? '🖼️' : '📚'}
                    </span>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            <div className="space-y-1">
                <h3 className="font-bold text-gray-200 text-xs md:text-sm truncate group-hover:text-blue-400 transition-colors leading-tight">
                    {title}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-500 font-medium">{subtitle}</p>
            </div>
        </div>
    );
}

export function TestCard({ title, tag, isNew }: { title: string, tag?: string, isNew?: boolean }) {
    return (
        <div className="group relative min-w-[260px] p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300">
            <div className="relative h-full bg-neutral-900/90 backdrop-blur-xl rounded-[20px] p-5 border border-white/5 flex flex-col justify-between hover:bg-neutral-900 transition-colors">
                {/* Badge */}
                {isNew && (
                    <div className="absolute top-4 right-4">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                    </div>
                )}

                <div className="flex gap-4 items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-2xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 border border-white/5 transition-all duration-300">
                        📝
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-100 text-[15px] leading-snug group-hover:text-blue-400 transition-colors">
                            {title}
                        </h3>
                        {tag && <p className="text-xs text-gray-500 mt-1 font-medium">{tag}</p>}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-300 transition-colors">
                        Start Test
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
