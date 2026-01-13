export const Mentors = () => {
    // Placeholder data - eventually fetched from Firestore
    const mentors = [
        {
            name: "GAURAV ARYA",
            role: "Lead Mentor",
            image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Oliver",
            quote: "Success is not final, failure is not fatal: it is the courage to continue that counts."
        },
        {
            name: "KOPAL KATARIA",
            role: "Mathematics Expert",
            image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Kopal",
            quote: "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding."
        },
        {
            name: "SUSHANT PATEL",
            role: "Physics Specialist",
            image: "https://api.dicebear.com/7.x/big-smile/svg?seed=Sushant",
            quote: "Physics is the most fundamental of all sciences, it describes how the universe works."
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-black uppercase tracking-tighter italic">Top Mentors</h2>
                    <p className="text-black font-bold max-w-2xl mx-auto uppercase tracking-widest text-xs opacity-60">
                        Guided by the best minds dedicated to your success
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {mentors.map((mentor, index) => (
                        <div key={index} className="bg-white border-4 border-black rounded-3xl p-10 text-center hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:-translate-y-2 group">
                            <div className="w-28 h-28 mx-auto mb-8 rounded-2xl overflow-hidden border-4 border-black p-0 shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                                <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover bg-primary" />
                            </div>
                            <h3 className="text-2xl font-black mb-2 text-black uppercase italic">{mentor.name}</h3>
                            <p className="inline-block px-3 py-1 bg-primary text-black font-black text-[10px] mb-6 uppercase tracking-widest border-2 border-black rotate-1">{mentor.role}</p>
                            <p className="text-black font-bold text-sm italic opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity">"{mentor.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
