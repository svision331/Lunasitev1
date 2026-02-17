import React from "react";
import { Music, Volume2 } from "lucide-react";
import { TechBorder } from "@/components/ui/TechBorder";
import { HoloCard } from "@/components/ui/HoloCard";
import { GridBackground } from "@/components/effects/GridBackground";

interface MusicPlayerProps {
    onClose: () => void;
}

export function MusicPlayer({ onClose }: MusicPlayerProps) {
    return (
        <TechBorder className="w-full h-full" color="pink" cornerSize={12}>
            <HoloCard variant="active" className="w-full h-full flex flex-col relative overflow-hidden bg-black/50">
                <GridBackground opacity={0.1} color="rgba(236, 72, 153, 1)" />

                {/* Standard Header */}
                <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-pink-400">
                        <Music size={16} className="animate-pulse" />
                        <span className="text-xs tracking-[0.2em] font-bold uppercase">Sonic Array</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                        <span className="flex items-center gap-1 mr-2 hidden sm:flex">
                            <Volume2 size={10} /> AUDIO_OUT // ACTIVE
                        </span>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="flex items-center gap-1 hover:text-red-400 transition-colors uppercase border border-white/5 hover:border-red-500/30 px-2 py-1 rounded bg-black/40"
                        >
                            <span className="text-red-500/80 font-bold">[ End ]</span>
                        </button>
                    </div>
                </div>

                {/* Spotify Embed Container */}
                <div className="flex-1 p-4 overflow-hidden relative z-10">
                    <div className="w-full h-full rounded-xl overflow-hidden border border-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.1)] relative group">
                        {/* Loading/Placeholder State (Behind iframe) */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                            <div className="animate-pulse text-pink-500/20 tracking-widest text-xs">INITIALIZING STREAM...</div>
                        </div>

                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/artist/3bf4MuySAAvfxhHNW4du3x?utm_source=generator&theme=0"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="bg-transparent relative z-10"
                        />
                    </div>
                </div>
            </HoloCard>
        </TechBorder>
    );
}
