export default function Header() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
                <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-2xl bg-neutral-900 flex items-center justify-center text-lg md:text-xl">
                            👤
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-neutral-900 rounded-full"></div>
                </div>
                <div>
                    <h2 className="text-base md:text-lg font-bold text-white leading-tight">Welcome back, Student! 👋</h2>
                    <p className="text-xs md:text-sm text-gray-400">Let's continue your learning journey.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white">Live Classes</span>
                </div>

                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 px-4 py-2 md:px-5 md:py-2.5 rounded-xl cursor-pointer hover:border-white/20 transition-all w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">🎯</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wider hidden md:block">Daily Goal</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs md:text-sm font-bold text-white">0/75 Qs</span>
                                {/* Mini Progress Bar */}
                                <div className="w-12 md:w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="w-0 h-full bg-blue-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="text-gray-500 text-sm ml-2">→</span>
                </div>
            </div>
        </div>
    );
}
