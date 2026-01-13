interface SectionProps {
    title: string;
    children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
    return (
        <section className="mb-12">
            <div className="px-6 mb-6 flex justify-between items-end">
                <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
                <button className="text-sm text-primary hover:underline transition-all font-bold">
                    See All
                </button>
            </div>

            <div className="flex overflow-x-auto px-6 pb-6 gap-6 scrollbar-hide snap-x">
                {children}
            </div>
        </section>
    );
}
