export const Mentors = () => {
    // Placeholder data - eventually fetched from Firestore
    const mentors = [
        {
            name: "Rounak Paul",
            role: "Lead Mentor",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rounak",
            quote: "Success is not final, failure is not fatal: it is the courage to continue that counts."
        },
        {
            name: "Aditi Singh",
            role: "Mathematics Expert",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi",
            quote: "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding."
        },
        {
            name: "Vikram Kumar",
            role: "Physics Specialist",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
            quote: "Physics is the most fundamental of all sciences, it describes how the universe works."
        }
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet Your Mentors</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Get guided by the best minds who are dedicated to your success.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mentors.map((mentor, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-purple-500 p-1">
                                <img src={mentor.image} alt={mentor.name} className="w-full h-full rounded-full object-cover bg-white/10" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
                            <p className="text-purple-400 text-sm font-medium mb-4">{mentor.role}</p>
                            <p className="text-gray-400 text-sm italic">"{mentor.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
