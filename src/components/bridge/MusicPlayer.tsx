import React from "react";
import { Music, Volume2 } from "lucide-react";

interface MusicPlayerProps {
    onClose: () => void;
}

export function MusicPlayer({ onClose }: MusicPlayerProps) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black/50">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-purple-900/20" />
            </div>

            {/* Back Button */}
            {/* End Transmission Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 flex items-center gap-1 hover:text-red-400 transition-colors uppercase"
            >
                <span className="text-red-500/80 font-mono text-xs">[ End Transmission ]</span>
            </button>

            {/* Header Info */}
            <div className="text-center space-y-2 mb-6 z-10 w-full max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md mb-2">
                    <Music size={12} className="text-pink-400" />
                    <span className="text-[10px] tracking-widest uppercase text-pink-200">System Audio</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight glitch-text relative">
                    DISCOGRAPHY
                </h2>
            </div>

            {/* Spotify Embed */}
            <div className="w-full max-w-3xl h-[60vh] relative z-10 rounded-xl overflow-hidden shadow-2xl shadow-cyan-900/20">
                <iframe
                    style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/artist/3bf4MuySAAvfxhHNW4du3x?utm_source=generator&theme=0"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="bg-black/40"
                />
            </div>

            {/* Volume/Meta */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white/30">
                <Volume2 size={14} />
                <span className="text-[10px] font-mono">EXT_SOURCE</span>
            </div>
        </div>
    );
}
