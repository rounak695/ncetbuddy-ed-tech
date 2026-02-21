import Link from "next/link";
import { Zap, BookOpen, Image as ImageIcon, ClipboardList } from "lucide-react";

// Utility for gradients (Updated for light theme)
const gradients = {
    yellow: "from-yellow-100/50 via-primary/10 to-transparent",
    cyan: "from-cyan-100/50 via-blue-100/30 to-transparent",
    pink: "from-pink-100/50 via-purple-100/30 to-transparent",
    green: "from-green-100/50 via-emerald-100/30 to-transparent",
};

const FormulaCardContent = ({ title, items }: { title: string, items: string }) => (
    <>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Zap size={18} className="text-yellow-500" />
                </div>
            </div>

            <div>
                <div className="text-[10px] md:text-xs text-secondary font-bold mb-1 tracking-wide uppercase">Formula Sheet</div>
                <div className="font-bold text-foreground text-base md:text-lg leading-tight truncate">
                    {title}
                </div>
                <div className="text-[10px] md:text-xs text-secondary font-medium mt-0.5">{items}</div>
            </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-300" />
    </>
);

export function FormulaCard({ title, items, color, href }: { title: string, items: string, color: string, href?: string }) {
    let gradient = gradients.yellow;
    if (color === '#A0E7E5') gradient = gradients.cyan;
    if (color === '#FFAEBC') gradient = gradients.pink;
    if (color === '#B4F8C8') gradient = gradients.green;

    const className = `
        group relative h-28 md:h-32 rounded-3xl p-4 md:p-5 overflow-hidden cursor-pointer
        bg-gradient-to-br ${gradient}
        border border-border hover:border-primary/30 transition-all duration-300
        hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1
        w-full block
    `;

    if (href) {
        const isExternal = href.startsWith('http');
        if (isExternal) {
            return (
                <a href={href} className={className} target="_blank" rel="noopener noreferrer">
                    <FormulaCardContent title={title} items={items} />
                </a>
            );
        }
        return (
            <Link href={href} className={className}>
                <FormulaCardContent title={title} items={items} />
            </Link>
        );
    }

    return (
        <div className={className}>
            <FormulaCardContent title={title} items={items} />
        </div>
    );
}

const BookCardContent = ({ title, subtitle, image }: { title: string, subtitle: string, image?: string }) => (
    <>
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg shadow-black/5 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:-translate-y-2">
            <div className="absolute inset-0 bg-white border border-border group-hover:border-primary transition-colors">
                <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-black/5 h-full" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300 text-primary/60">
                    {image ? <ImageIcon size={48} /> : <BookOpen size={48} />}
                </span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-primary/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        <div className="space-y-1">
            <h3 className="font-bold text-foreground text-xs md:text-sm truncate group-hover:text-primary transition-colors leading-tight">
                {title}
            </h3>
            <p className="text-[10px] md:text-xs text-secondary font-bold">{subtitle}</p>
        </div>
    </>
);

export function BookCard({ title, subtitle, image, href }: { title: string, subtitle: string, image?: string, href?: string }) {
    const className = "group flex flex-col gap-3 md:gap-4 cursor-pointer min-w-[130px] md:w-[160px] snap-center block";

    if (href) {
        const isExternal = href.startsWith('http');
        if (isExternal) {
            return (
                <a href={href} className={className} target="_blank" rel="noopener noreferrer">
                    <BookCardContent title={title} subtitle={subtitle} image={image} />
                </a>
            );
        }
        return (
            <Link href={href} className={className}>
                <BookCardContent title={title} subtitle={subtitle} image={image} />
            </Link>
        );
    }

    return (
        <div className={className}>
            <BookCardContent title={title} subtitle={subtitle} image={image} />
        </div>
    );
}

const TestCardContent = ({ title, tag, isNew }: { title: string, tag?: string, isNew?: boolean }) => (
    <div className="relative h-full bg-card rounded-[20px] p-5 border border-border flex flex-col justify-between hover:border-primary/30 transition-all">
        {isNew && (
            <div className="absolute top-4 right-4">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
            </div>
        )}

        <div className="flex gap-4 items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-300 border border-border group-hover:border-primary">
                <ClipboardList size={24} className="text-primary group-hover:text-black transition-colors" />
            </div>
            <div>
                <h3 className="font-bold text-foreground text-[15px] leading-snug group-hover:text-black transition-colors">
                    {title}
                </h3>
                {tag && <p className="text-xs text-secondary mt-1 font-bold">{tag}</p>}
            </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
            <span className="text-xs font-bold text-secondary group-hover:text-foreground transition-colors">
                Start Test
            </span>
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-secondary group-hover:bg-black group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
        </div>
    </div>
);

export function TestCard({ title, tag, isNew, href }: { title: string, tag?: string, isNew?: boolean, href?: string }) {
    const className = "group relative min-w-[260px] p-1 rounded-3xl bg-gray-100 hover:bg-primary/10 transition-all duration-300 block";

    if (href) {
        const isExternal = href.startsWith('http');
        if (isExternal) {
            return (
                <a href={href} className={className} target="_blank" rel="noopener noreferrer">
                    <TestCardContent title={title} tag={tag} isNew={isNew} />
                </a>
            );
        }
        return (
            <Link href={href} className={className}>
                <TestCardContent title={title} tag={tag} isNew={isNew} />
            </Link>
        );
    }

    return (
        <div className={className}>
            <TestCardContent title={title} tag={tag} isNew={isNew} />
        </div>
    );
}
