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
    return (
        <div className="latex-rendered" data-version="v4.0-markdown">
            {/* Magenta dot to confirm Markdown Renderer is active */}
            <span
                title="LatexRenderer v4 (Markdown) Active"
                style={{
                    fontSize: '0.6em',
                    color: 'magenta',
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
                    {children}
                </ReactMarkdown>
            </div>
        </div>
    );
};
