"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Bot, X, Sparkles, Send, User } from 'lucide-react';

export const AskConceptsAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat'
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div 
                    className="mb-4 w-[350px] sm:w-[400px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out transform origin-bottom-right" 
                    style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
                >
                    {/* Header */}
                    <div className="bg-[#0F172A]/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.5)]">
                                <Bot className="text-rose-400 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg flex items-center gap-2 leading-none mb-1">
                                    Ask Concepts AI <Sparkles className="w-3 h-3 text-yellow-400" />
                                </h3>
                                <p className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Unlock Clarity Instantly</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#0F172A]/90 scroll-smooth">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-70 text-center px-4">
                                <Bot className="w-12 h-12 text-zinc-400 mb-4" />
                                <p className="text-zinc-300 text-sm">Hi! I'm your NCET Expert. Ask me about ITEP colleges, subject strategies, or specific concepts.</p>
                            </div>
                        )}
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${m.role === 'user' ? 'bg-zinc-800' : 'bg-rose-500/20 border border-rose-500/30'}`}>
                                        {m.role === 'user' ? <User className="w-4 h-4 text-zinc-300" /> : <Bot className="w-4 h-4 text-rose-400" />}
                                    </div>
                                    <div className={`px-4 py-3 text-sm ${
                                        m.role === 'user' 
                                            ? 'bg-zinc-800 text-white rounded-2xl rounded-tr-none' 
                                            : 'bg-white/5 border border-white/10 text-zinc-200 rounded-2xl rounded-tl-none format-markdown'
                                    }`}>
                                        {/* Simple markdown parsing for bold text and newlines */}
                                        {m.content.split('\n').map((line, i) => (
                                            <p key={i} className="mb-2 last:mb-0 leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[85%] flex-row">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mt-1">
                                        <Bot className="w-4 h-4 text-rose-400" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none flex items-center gap-1.5 h-10">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-[#0F172A] border-t border-white/10">
                        <form onSubmit={handleSubmit} className="relative flex items-center">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type your question..."
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-1.5 w-9 h-9 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-tr from-rose-600 to-rose-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] text-white hover:scale-110 transition-all duration-300 relative group"
                >
                    <Bot className="w-7 h-7" />
                    <Sparkles className="w-4 h-4 text-yellow-300 absolute top-2 right-2 animate-pulse" />
                    
                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#0F172A] text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none">
                        Ask Concepts AI
                        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0F172A] border-r border-t border-white/10 rotate-45" />
                    </div>
                </button>
            )}
        </div>
    );
};
