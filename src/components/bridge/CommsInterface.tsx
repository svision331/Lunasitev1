import React, { useEffect, useRef, useState } from "react";
import { Send, Radio, Wifi } from "lucide-react";
import { useChat } from "@ai-sdk/react";

interface CommsInterfaceProps {
    onClose: () => void;
}

export function CommsInterface({ onClose }: CommsInterfaceProps) {
    const { messages, append, isLoading } = useChat({
        api: '/api/chat',
        initialMessages: [
            { id: "init-1", role: "system", content: "Comms link established... Scanning frequencies...", createdAt: new Date() },
            { id: "init-2", role: "assistant", content: "Signal received. I am listening, Space Invader. 📡", createdAt: new Date() }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any) as any;

    const [localInput, setLocalInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!localInput.trim() || isLoading) return;

        const content = localInput;
        setLocalInput(""); // Clear immediately
        await append({ role: 'user', content });
    };

    return (
        <div className="w-full h-full flex flex-col p-4 relative overflow-hidden bg-black/50 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 text-amber-400">
                    <Radio size={16} className="animate-pulse" />
                    <span className="text-xs tracking-[0.2em] font-bold uppercase">Signal Decoder</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-white/40 font-mono">
                    <span className="flex items-center gap-1">
                        <Wifi size={10} /> {isLoading ? "TRANSMITTING..." : "128.4 Mhz"}
                    </span>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 hover:text-red-400 transition-colors uppercase"
                    >
                        <span className="text-red-500/80">[ End Transmission ]</span>
                    </button>
                </div>
            </div>

            {/* Message Feed */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent"
            >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {messages.map((msg: any) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                        {msg.role !== 'system' && (
                            <div className={`
                                max-w-[85%] rounded px-3 py-2 text-xs font-mono border-l-2
                                ${msg.role === "assistant" ? "border-cyan-500/50 text-cyan-200 bg-cyan-950/20" :
                                    "border-emerald-500/50 text-emerald-100 bg-emerald-950/20"}
                            `}>
                                <div className="flex items-center justify-between gap-4 mb-1 border-b border-white/5 pb-1">
                                    <span className="opacity-70 font-bold uppercase tracking-wider text-[10px]">
                                        {msg.role === 'user' ? 'YOU' : 'LUNA'}
                                    </span>
                                </div>
                                <div className="leading-relaxed opacity-90 whitespace-pre-wrap">
                                    {msg.content}
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
                    <div className="flex flex-col items-start">
                        <div className="max-w-[85%] rounded px-3 py-2 text-xs font-mono border-l-2 border-cyan-500/50 text-cyan-200/50 bg-cyan-950/10">
                            <span className="animate-pulse">Decoding signal...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="relative mt-auto">
                <input
                    type="text"
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
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
    );
}
