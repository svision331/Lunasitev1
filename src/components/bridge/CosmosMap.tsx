import React, { useState } from 'react';
import { COSMOS_SYSTEMS, StarSystem } from '@/data/cosmos';
import { StarSystemNode } from './StarSystemNode';
import { CosmosBackground } from './CosmosBackground';
import { Shield, Globe } from 'lucide-react';
import { TechBorder } from '@/components/ui/TechBorder';
import { HoloCard } from '@/components/ui/HoloCard';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCosmos } from '@/app/actions/fetchers';
import { useEffect } from 'react';

interface CosmosMapProps {
    onClose?: () => void;
}

export function CosmosMap({ onClose }: CosmosMapProps) {
    const [hoveredSystem, setHoveredSystem] = useState<StarSystem | null>(null);
    const [activeSystem, setActiveSystem] = useState<StarSystem | null>(null);
    const [systems, setSystems] = useState<StarSystem[]>(COSMOS_SYSTEMS);

    useEffect(() => {
        fetchCosmos().then(res => {
            if (res && res.length) setSystems(res);
        });
    }, []);

    return (
        <TechBorder className="w-full h-full" color="cyan" cornerSize={12}>
            <div className="relative w-full h-full overflow-hidden bg-black font-mono group transform-gpu flex flex-col">

                {/* Standard Module Header */}
                <header className="shrink-0 p-4 border-b border-white/5 bg-black/40 flex items-center justify-between relative z-50">
                    <div className="flex items-center gap-3">
                        <HoloCard variant="active" className="w-8 h-8 flex items-center justify-center rounded-lg">
                            <Globe size={16} className="text-cyan-300 animate-pulse" />
                        </HoloCard>
                        <div>
                            <div className="text-[10px] tracking-[0.2em] uppercase text-cyan-500/50">Module</div>
                            <div className="text-sm font-bold tracking-widest text-white uppercase glow-text">Cosmos Navigator</div>
                        </div>
                    </div>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors rounded-lg group/close"
                        >
                            <span className="sr-only">Close</span>
                            <div className="text-[10px] uppercase tracking-widest group-hover/close:opacity-100 opacity-0 transition-opacity absolute right-12 top-1/2 -translate-y-1/2 whitespace-nowrap">
                                End Transmission
                            </div>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </header>

                <div className="relative flex-1 overflow-hidden">
                    {/* Optimized Background Layer */}
                    <CosmosBackground isPaused={!!activeSystem} />

                    {/* Interactive Systems */}
                    <div className="absolute inset-0">
                        {systems.map(system => (
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
                    <AnimatePresence>
                        {activeSystem && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-40 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 md:p-10"
                                onClick={() => setActiveSystem(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="max-w-md w-full"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <TechBorder color="cyan" intensity="high" className="w-full">
                                        <HoloCard variant="default" className="p-6 md:p-8 bg-black/80 relative overflow-hidden text-center group/warp border-cyan-500/30">
                                            {/* Rotating Rings Background */}
                                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-cyan-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                                            </div>

                                            <div className="relative z-10 space-y-4 md:space-y-6 flex flex-col items-center justify-center min-h-[200px]">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 mt-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse relative z-20" />
                                                    <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-200 font-bold relative z-20">Wormhole Active</span>
                                                </div>

                                                <div>
                                                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 glitch-text">{activeSystem.location}</h2>
                                                    <div className="text-cyan-400 text-xs tracking-[0.3em] uppercase opacity-70">Destination Locked</div>
                                                </div>

                                                <div className="py-4 md:py-6 border-y border-white/10 space-y-2 w-full">
                                                    <div className="text-lg md:text-xl text-cyan-300 font-bold tracking-widest uppercase truncate px-4">{activeSystem.spotifyData.trackTitle}</div>
                                                    <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest text-white/40">
                                                        <span>{activeSystem.spotifyData.album}</span>
                                                        <span>{'//'}</span>
                                                        <span>{activeSystem.spotifyData.duration}</span>
                                                    </div>
                                                </div>

                                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-cyan-500 animate-[loading_1.5s_ease-in-out_infinite] w-1/2" />
                                                </div>

                                                <button
                                                    onClick={() => setActiveSystem(null)}
                                                    className="inline-block px-6 py-3 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 hover:border-red-500/60 transition-all uppercase tracking-widest"
                                                >
                                                    Abort Jump Sequence
                                                </button>
                                            </div>
                                        </HoloCard>
                                    </TechBorder>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] uppercase text-white/30 tracking-widest pointer-events-none font-mono z-30">
                        <Shield size={12} className="text-emerald-500" />
                        Defenses Online
                        <span className="mx-2 text-white/10">|</span>
                        <div className="w-2 h-2 rounded-full bg-cyan-500/50 animate-pulse" />
                        Radar Active
                    </div>
                </div>
            </div>
        </TechBorder>
    );
}
