"use client";

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
    children: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ children }) => {
    const renderedContent = useMemo(() => {
        if (!children) return null;

        // Regular expression to find LaTeX parts enclosed in $...$
        // This splits the string into: [text, latex, text, latex, ...]
        const parts = children.split(/(\$[^$]+\$)/g);

        return parts.map((part, index) => {
            if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
                try {
                    // Remove the surrounding $ signs
                    const latex = part.slice(1, -1);
                    const html = katex.renderToString(latex, {
                        throwOnError: false,
                        displayMode: false,
                    });
                    return (
                        <span
                            key={index}
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    );
                } catch (error) {
                    console.error("KaTeX rendering error:", error);
                    return <span key={index}>{part}</span>;
                }
            }
            return <span key={index}>{part}</span>;
        });
    }, [children]);

    return <>{renderedContent}</>;
};
