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

        // Split by $$...$$ (display) or $...$ (inline)
        // Regex explanation:
        // (\$\$[\s\S]+?\$\$) -> Capture display math
        // (\$[^\$]+?\$) -> Capture inline math
        const regex = /(\$\$[\s\S]+?\$\$)|(\$[^\$]+?\$)/g;

        const parts = children.split(regex);

        return parts.map((part, index) => {
            if (!part) return null;

            if (part.startsWith('$$') && part.endsWith('$$')) {
                // Display Mode
                try {
                    const latex = part.slice(2, -2);
                    const html = katex.renderToString(latex, {
                        throwOnError: false,
                        displayMode: true,
                    });
                    return (
                        <span
                            key={index}
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    );
                } catch (error) {
                    console.error("KaTeX Display Error:", error);
                    return <span key={index} style={{ color: 'red' }}>Error: {part}</span>;
                }
            } else if (part.startsWith('$') && part.endsWith('$')) {
                // Inline Mode
                try {
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
                    console.error("KaTeX Inline Error:", error);
                    // Render the original part but maybe with a warning style if needed
                    // For now, let's just return key+part helps react reconciliation
                    return <span key={index} style={{ color: 'red', fontSize: '0.8em' }}>[LaTeX Error: {part}]</span>;
                }
            } else {
                // Regular text
                // Check if it is a capture group artifact (undefined)
                if (part === undefined) return null;
                return <span key={index}>{part}</span>;
            }
        });
    }, [children]);

    return <>{renderedContent}</>;
};
