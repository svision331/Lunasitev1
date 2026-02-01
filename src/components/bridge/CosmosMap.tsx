import React, { useState } from 'react';
import { COSMOS_SYSTEMS, StarSystem } from '@/data/cosmos';
import { StarSystemNode } from './StarSystemNode';
import { CosmosBackground } from './CosmosBackground';
import { Shield } from 'lucide-react';

interface CosmosMapProps {
    onClose?: () => void;
}

export function CosmosMap({ onClose }: CosmosMapProps) {
    const [hoveredSystem, setHoveredSystem] = useState<StarSystem | null>(null);
    const [activeSystem, setActiveSystem] = useState<StarSystem | null>(null);

    // Animation state control


    return (
        <div className="relative w-full h-full overflow-hidden bg-black rounded-xl border border-white/5 font-mono group transform-gpu">

            {/* End Transmission Button */}
            {/* End Transmission Button */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-red-500/20 rounded-full text-xs font-mono text-red-500/80 hover:bg-red-950/30 hover:text-red-400 transition-all duration-300 group/btn uppercase tracking-widest"
                >
                    <span>[ End Transmission ]</span>
                </button>
            )}

            {/* Optimized Background Layer */}
            <CosmosBackground isPaused={!!activeSystem} />

            {/* 4. Interactive Systems */}
            <div className="absolute inset-0">
                {COSMOS_SYSTEMS.map(system => (
                    <StarSystemNode
                        key={system.id}
                        system={system}
                        onHover={setHoveredSystem}
                        onLeave={() => setHoveredSystem(null)}
                        onClick={setActiveSystem}
                        isHovered={hoveredSystem?.id === system.id}
                        isDimmed={hoveredSystem !== null && hoveredSystem.id !== system.id}
                    />
                ))}
            </div>



            {/* Active System Overlay (Warp Interface) */}
            {activeSystem && (
                <div className="absolute inset-0 z-40 bg-black/90 flex items-center justify-center animate-in fade-in duration-300 backdrop-blur-sm" onClick={() => setActiveSystem(null)}>
                    <div className="text-center relative">
                        {/* Rotating Rings */}
                        <div className="absolute inset-0 -m-20 border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-0 -m-10 border border-dashed border-cyan-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                        <div className="text-cyan-400 text-xs tracking-[0.5em] animate-pulse mb-6">WORMHOLE ACTIVE</div>
                        <h2 className="text-5xl font-mono font-bold text-white mb-2 glitch-text">{activeSystem.location}</h2>

                        {/* Track Info Display in Warp Mode */}
                        <div className="flex flex-col items-center mt-4 mb-8">
                            <div className="text-2xl text-cyan-300 font-bold tracking-widest uppercase glow-text">{activeSystem.spotifyData.trackTitle}</div>
                            <div className="text-white/50 text-xs tracking-[0.2em] mt-1">{activeSystem.spotifyData.album} {'//'} {activeSystem.spotifyData.duration}</div>
                        </div>

                        <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden relative">
                            <div className="absolute inset-0 bg-cyan-500 animate-[loading_1.5s_ease-in-out_infinite] w-1/2" />
                        </div>

                        <button className="mt-8 px-6 py-2 border border-red-500/50 text-red-400 text-xs hover:bg-red-500/10 transition-colors uppercase tracking-widest">
                            Abort Jump
                        </button>
                    </div>
                </div>
            )}

            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] uppercase text-white/30 tracking-widest pointer-events-none font-mono">
                <Shield size={12} className="text-emerald-500" />
                Defenses Online
            </div>
        </div>
    );
}
