import { testimonials } from "@/data/testimonials";

export const Testimonials = () => {
    // Hide section if no testimonials
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-black uppercase tracking-tighter italic">Testimonials</h2>
                    <p className="text-black font-bold max-w-2xl mx-auto uppercase tracking-widest text-xs opacity-60">
                        Real feedback from students and teachers using NCET Buddy
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white border-4 border-black rounded-3xl p-10 text-center hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:-translate-y-2 group">
                            <h3 className="text-2xl font-black mb-4 text-black uppercase italic">{testimonial.name}</h3>
                            <p className="inline-block px-3 py-1 bg-primary text-black font-black text-[10px] mb-6 uppercase tracking-widest border-2 border-black rotate-1">{testimonial.role}</p>
                            <p className="text-black font-bold text-sm italic opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity">"{testimonial.review}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
