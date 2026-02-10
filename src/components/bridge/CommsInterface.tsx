import React, { useEffect, useRef, useState } from "react";
import { Send, Radio, Wifi, ArrowUp, Trash2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { TechBorder } from "@/components/ui/TechBorder";
import { GridBackground } from "@/components/effects/GridBackground";

import { useSoundEffects } from "@/hooks/useSoundEffects";

interface CommsInterfaceProps {
    onClose: () => void;
}

type Message = {
    id: string;
    role: 'system' | 'user' | 'assistant';
    content: string;
};

const INITIAL_MESSAGES: Message[] = [
    { id: "init-1", role: "system", content: "Comms link established... Scanning frequencies..." },
    { id: "init-2", role: "assistant", content: "Signal received. I am listening, Space Invader. 📡" }
];

export function CommsInterface({ onClose }: CommsInterfaceProps) {
    const { playTyping, playSuccess, playClick, playError } = useSoundEffects();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [localInput, setLocalInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

    // Auto-scroll to bottom on new messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Monitor scroll position to show/hide "Back to Top"
    const handleScroll = () => {
        if (containerRef.current) {
            setShowScrollTop(containerRef.current.scrollTop > 100);
        }
    };

    const scrollToTop = () => {
        playClick();
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const clearHistory = () => {
        playError(); // Use error sound as a "wipe" effect
        setMessages(INITIAL_MESSAGES);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!localInput.trim() || isLoading) return;

        playClick();
        const content = localInput;
        setLocalInput("");
        setIsLoading(true);

        // Add User Message
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);

        // Immediate scroll after user sends
        setTimeout(scrollToBottom, 100);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok || !response.body) throw new Error("Connection failed");

            // Add empty assistant message to stream into
            const assistantId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                assistantContent += chunk;

                setMessages(prev => prev.map(msg =>
                    msg.id === assistantId ? { ...msg, content: assistantContent } : msg
                ));
            }

            playSuccess();
        } catch (err) {
            console.error("Transmission error details:", err);
            setMessages(prev => [...prev, { id: `error-${Date.now()}`, role: "system", content: "⚠️ SIGNAL LOST. RETRY TRANSMISSION." }]);
        } finally {
            setIsLoading(false);
            setTimeout(scrollToBottom, 100); // Final scroll
        }
    };

    return (
        <TechBorder className="w-full h-full" color="amber" cornerSize={12}>
            <div className="w-full h-full flex flex-col p-4 relative overflow-hidden bg-black/50">
                <GridBackground opacity={0.1} color="rgba(251, 191, 36, 1)" />

                {/* Header */}
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2 bg-black/20 backdrop-blur-sm sticky top-0 z-10 -mx-4 px-4 pt-2 -mt-2 relative">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Radio size={16} className="animate-pulse" />
                        <span className="text-xs tracking-[0.2em] font-bold uppercase">Signal Decoder</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                        <span className="flex items-center gap-1 mr-2 hidden sm:flex">
                            <Wifi size={10} /> {isLoading ? "INCOMING TRANSMISSION..." : "128.4 Mhz // CONNECTED"}
                        </span>

                        {/* Clear Button */}
                        <button
                            onClick={clearHistory}
                            className="flex items-center gap-1 hover:text-white transition-colors uppercase border border-white/5 hover:border-white/20 px-2 py-1 rounded bg-black/40 mr-1"
                            title="Clear Signal History"
                        >
                            <Trash2 size={10} />
                            <span className="hidden sm:inline">Clear</span>
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="flex items-center gap-1 hover:text-red-400 transition-colors uppercase border border-white/5 hover:border-red-500/30 px-2 py-1 rounded bg-black/40"
                        >
                            <span className="text-red-500/80 font-bold">[ End ]</span>
                        </button>
                    </div>
                </div>

                {/* Message Feed */}
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="flex-1 min-h-0 overflow-y-auto space-y-3 mb-4 pr-2 scrollbar-thin scrollbar-thumb-amber-500/50 scrollbar-track-transparent overscroll-contain touch-pan-y relative z-10"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                        >
                            {msg.role !== 'system' && (
                                <div className={`
                                    max-w-[85%] rounded px-3 py-2 text-xs font-mono border-l-2 backdrop-blur-sm
                                    ${msg.role === "assistant" ? "border-cyan-500/50 text-cyan-200 bg-cyan-950/40 shadow-[0_0_15px_rgba(8,145,178,0.1)]" :
                                        "border-emerald-500/50 text-emerald-100 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]"}
                                `}>
                                    <div className="flex items-center justify-between gap-4 mb-1 border-b border-white/5 pb-1">
                                        <span className="opacity-70 font-bold uppercase tracking-wider text-[10px]">
                                            {msg.role === 'user' ? 'YOU' : 'LUNA'}
                                        </span>
                                    </div>
                                    <div className="leading-relaxed opacity-90 start-markdown">
                                        {msg.role === 'assistant' ? (
                                            <ReactMarkdown
                                                components={{
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-1" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-1" {...props} />,
                                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="text-cyan-100 font-bold" {...props} />,
                                                    em: ({ node, ...props }) => <em className="text-cyan-300 not-italic" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            <span className="whitespace-pre-wrap">{msg.content}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                            {msg.role === 'system' && (
                                <div className="w-full text-center py-2">
                                    <span className="text-[10px] uppercase tracking-widest text-amber-500/50 font-mono">
                                        {msg.content}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex flex-col items-start animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="max-w-[85%] rounded px-3 py-2 text-xs font-mono border-l-2 border-cyan-500/50 text-cyan-200/50 bg-cyan-950/10 backdrop-blur-sm">
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin text-[10px]">◐</span>
                                    <span className="animate-pulse tracking-widest">DECODING SIGNAL FRAGMENT...</span>
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />

                    {/* Scroll to Top Button */}
                    <button
                        onClick={scrollToTop}
                        className={`
                            absolute bottom-4 right-2 p-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400
                            hover:bg-amber-500/20 hover:text-amber-200 transition-all duration-300 z-20 backdrop-blur-sm
                            ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                        `}
                        title="Return to Bridge Controls"
                    >
                        <ArrowUp size={16} />
                    </button>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="relative mt-auto z-10">
                    <input
                        type="text"
                        value={localInput}
                        onChange={(e) => {
                            setLocalInput(e.target.value);
                            playTyping();
                        }}
                        placeholder="Broadcast signal..."
                        className="w-full bg-black/60 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-mono placeholder:text-white/20"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !localInput.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-amber-400 hover:text-amber-200 transition-colors hover:bg-amber-500/10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </TechBorder>
    );
}
