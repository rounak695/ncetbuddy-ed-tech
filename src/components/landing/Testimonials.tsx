import { testimonials } from "@/data/testimonials";

export const Testimonials = () => {
    // Hide section if no testimonials
    if (testimonials.length === 0) {
        return null;
    }

    // Duplicate testimonials to create seamless loop
    const seamlessTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 w-full">
                <div className="container mx-auto px-4 mb-16 text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-black uppercase tracking-tighter italic">Testimonials</h2>
                    <p className="text-black font-bold max-w-2xl mx-auto uppercase tracking-widest text-xs opacity-60">
                        Real feedback from students and teachers using NCET Buddy
                    </p>
                </div>

                {/* Marquee Container */}
                <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <div className="flex items-center justify-center md:justify-start animate-scroll hover:[animation-play-state:paused]">
                        {seamlessTestimonials.map((testimonial, index) => (
                            <div
                                key={`${testimonial.name}-${index}`}
                                className="w-[350px] md:w-[450px] flex-shrink-0 mx-6 bg-white border-4 border-black rounded-3xl p-8 text-center hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group cursor-default h-full flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black mb-3 text-black uppercase italic">{testimonial.name}</h3>
                                    <span className="inline-block px-3 py-1 bg-primary text-black font-black text-[10px] mb-5 uppercase tracking-widest border-2 border-black rotate-1">
                                        {testimonial.role}
                                    </span>
                                </div>
                                <div className="relative">
                                    <span className="absolute -top-4 -left-2 text-6xl text-primary/20 font-serif leading-none">"</span>
                                    <p className="text-black font-medium text-sm md:text-base leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity relative z-10">
                                        {testimonial.review}
                                    </p>
                                    <span className="absolute -bottom-6 -right-2 text-6xl text-primary/20 font-serif leading-none rotate-180">"</span>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
