
export interface Video {
    id: string;
    title: string;
    youtubeId: string;
    duration?: string;
}

export interface Module {
    id: string;
    title: string;
    videos: Video[];
}

export interface EducatorCatalog {
    id: string;
    name: string;
    subject: string;
    logoUrl?: string;
    modules: Module[];
}

/**
 * Parses the Educator XML Catalog without external libraries.
 * Supports the specific schema defined for Video Classes.
 */
export const parseEducatorXml = (xml: string): EducatorCatalog | null => {
    try {
        // Simple regex-based parser for the constrained schema
        // Note: strictly follows the provided structure

        // 1. Extract Educator Attributes
        const educatorMatch = xml.match(/<educator\s+([^>]+)>/);
        if (!educatorMatch) return null;

        const eduAttrs = parseAttributes(educatorMatch[1]);

        // 2. Extract Modules
        const modules: Module[] = [];
        const moduleRegex = /<module\s+([^>]+)>([\s\S]*?)<\/module>/g;
        let moduleMatch;

        while ((moduleMatch = moduleRegex.exec(xml)) !== null) {
            const modAttrs = parseAttributes(moduleMatch[1]);
            const modContent = moduleMatch[2];

            const videos: Video[] = [];
            const videoRegex = /<video\s+([^>]+)\s*\/>/g;
            let videoMatch;

            while ((videoMatch = videoRegex.exec(modContent)) !== null) {
                const vidAttrs = parseAttributes(videoMatch[1]);
                if (vidAttrs.id && vidAttrs.title && vidAttrs.youtubeId) {
                    videos.push({
                        id: vidAttrs.id,
                        title: vidAttrs.title,
                        youtubeId: vidAttrs.youtubeId,
                        duration: vidAttrs.duration,
                    });
                }
            }

            if (modAttrs.id && modAttrs.title) {
                modules.push({
                    id: modAttrs.id,
                    title: modAttrs.title,
                    videos,
                });
            }
        }

        if (!eduAttrs.id || !eduAttrs.name || !eduAttrs.subject) return null;

        return {
            id: eduAttrs.id,
            name: eduAttrs.name,
            subject: eduAttrs.subject,
            logoUrl: eduAttrs.logoUrl,
            modules,
        };

    } catch (e) {
        console.error("XML Parse Error:", e);
        return null;
    }
};

const parseAttributes = (attrString: string): Record<string, string> => {
    const attrs: Record<string, string> = {};
    const regex = /(\w+)="([^"]*)"/g;
    let match;
    while ((match = regex.exec(attrString)) !== null) {
        attrs[match[1]] = match[2];
    }
    return attrs;
};
