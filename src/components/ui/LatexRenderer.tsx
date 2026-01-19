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

        const results = [];
        let lastIndex = 0;
        const regex = /(\$\$[\s\S]+?\$\$)|(\$[^$]+?\$)/g;

        let match;
        while ((match = regex.exec(children)) !== null) {
            // Push text before the match
            if (match.index > lastIndex) {
                results.push(<span key={`text-${lastIndex}`}>{children.slice(lastIndex, match.index)}</span>);
            }

            const fullMatch = match[0];
            const isBlock = fullMatch.startsWith('$$');
            const latex = isBlock ? fullMatch.slice(2, -2) : fullMatch.slice(1, -1);

            try {
                const html = katex.renderToString(latex, {
                    throwOnError: false,
                    displayMode: isBlock,
                });
                results.push(
                    <span
                        key={`math-${match.index}`}
                        dangerouslySetInnerHTML={{ __html: html }}
                        className="latex-math"
                    />
                );
            } catch (error) {
                console.error("KaTeX Error:", error);
                results.push(
                    <span key={`error-${match.index}`} style={{ color: 'red', fontWeight: 'bold' }}>
                        [Error: {latex}]
                    </span>
                );
            }

            lastIndex = regex.lastIndex;
        }

        // Push remaining text
        if (lastIndex < children.length) {
            results.push(<span key={`text-${lastIndex}`}>{children.slice(lastIndex)}</span>);
        }

        return results;
    }, [children]);

    const hasMath = children && children.includes('$');
    // Check if we actually rendered any math components
    // This is a rough check. If we found NO matches but there ARE '$' signs, we suspect a regex failure.
    const debugRegex = /(\$\$[\s\S]+?\$\$)|(\$[^$]+?\$)/g;
    const matchCount = (children.match(debugRegex) || []).length;
    const suspicious = hasMath && matchCount === 0;

    return (
        <span className="latex-rendered">
            {/* Blue dot to confirm component is active */}
            <span title="LatexRenderer v3 Active" style={{ fontSize: '0.6em', color: 'blue', verticalAlign: 'super', marginRight: '2px' }}>•</span>

            {suspicious && (
                <div style={{ border: '1px solid orange', padding: '5px', margin: '5px 0', fontSize: '0.8em', backgroundColor: '#fff3cd' }}>
                    <strong>Debug Warning:</strong> Found '$' characters but failed to identify LaTeX blocks.<br />
                    Raw Length: {children.length} | First char code: {children.charCodeAt(0)}<br />
                    Sample: {children.slice(0, 50)}...
                </div>
            )}

            {renderedContent}
        </span>
    );
};
