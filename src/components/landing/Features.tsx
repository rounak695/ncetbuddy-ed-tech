import { CalendarDays, ClipboardList, MessageCircle, BarChart2 } from "lucide-react";

export const Features = () => {
    const features = [
        {
            title: "AI Smart Planner",
            description: "No more confusion on what to study. Our AI analyzes your weak areas and creates a personalized daily roadmap.",
            icon: (<CalendarDays size={28} />),
            color: "bg-blue-500/10 text-blue-400"
        },
        {
            title: "Real NTA Mocks",
            description: "Practice on the exact same interface as the real exam. 10+ Full Syllabus Mocks & Chapter-wise Tests.",
            icon: (<ClipboardList size={28} />),
            color: "bg-purple-500/10 text-purple-400"
        },
        {
            title: "Doubt Forum",
            description: "Stuck on a problem? Ask the community, discuss strategies, and get solutions from top rankers.",
            icon: (<MessageCircle size={28} />),
            color: "bg-green-500/10 text-green-400"
        },
        {
            title: "Deep Analytics",
            description: "Track your accuracy, time management per question, and compare your live rank on the leaderboard.",
            icon: (<BarChart2 size={28} />),
            color: "bg-orange-500/10 text-orange-400"
        }
    ];

    return (
        <section id="features" className="py-24 bg-white relative">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-black uppercase tracking-tighter italic">Why Choose NCET Buddy?</h2>
                    <p className="text-black font-bold opacity-60 max-w-2xl mx-auto uppercase tracking-widest text-xs">
                        The most advanced preparation platform for serious aspirants
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white border-4 border-black rounded-3xl p-8 hover:shadow-[12px_12px_0px_0px_rgba(255,208,47,1)] transition-all duration-300 hover:-translate-y-2 group">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-black text-primary border-2 border-black group-hover:bg-primary group-hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-2xl">
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
