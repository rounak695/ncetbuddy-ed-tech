"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
    children: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ children }) => {
    // Preprocess: ensure no escaped dollar signs prevent rendering
    const content = React.useMemo(() => {
        if (!children) return "";
        return children.replace(/\\\$/g, '$');
    }, [children]);

    return (
        <div className="latex-rendered" data-version="v5.0-markdown">
            {/* Green dot to confirm v5 Update is Active */}
            <span
                title="LatexRenderer v5 (Markdown) Active"
                style={{
                    fontSize: '0.6em',
                    color: '#00ff00', // Green for v5
                    verticalAlign: 'super',
                    marginRight: '5px',
                    display: 'inline-block'
                }}
            >
                •
            </span>
            <div style={{ display: 'inline-block', verticalAlign: 'top', width: '95%' }}>
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};
