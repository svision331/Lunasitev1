import React from 'react';
import { StarSystem } from '@/data/cosmos';

interface StarSystemNodeProps {
    system: StarSystem;
    onHover: (system: StarSystem) => void;
    onLeave: () => void;
    onClick: (system: StarSystem) => void;
    isHovered: boolean;
    isDimmed: boolean;
}

export const StarSystemNode = React.memo(function StarSystemNode({ system, onHover, onLeave, onClick, isHovered, isDimmed }: StarSystemNodeProps) {
    const { visuals, coordinates, spotifyData } = system;

    // Tactical Color Map - More vibrant, less 'soft'
    const colorMap: Record<string, string> = {
        cyan: 'text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.4)]',
        purple: 'text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(192,132,252,0.4)]',
        pink: 'text-pink-400 border-pink-500/50 shadow-[0_0_10px_rgba(244,114,182,0.4)]',
        emerald: 'text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.4)]',
        amber: 'text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(251,191,36,0.4)]',
        rose: 'text-rose-400 border-rose-500/50 shadow-[0_0_10px_rgba(251,113,133,0.4)]',
        red: 'text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.4)]', // Added explicit Red
        violet: 'text-violet-400 border-violet-500/50 shadow-[0_0_10px_rgba(167,139,250,0.4)]',
        blue: 'text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(96,165,250,0.4)]',
    };

    // Explicit background map to ensure Tailwind JIT picks up these classes
    const bgMap: Record<string, string> = {
        cyan: 'bg-cyan-500',
        purple: 'bg-purple-500',
        pink: 'bg-pink-500',
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        rose: 'bg-rose-500',
        red: 'bg-red-500',
        violet: 'bg-violet-500',
        blue: 'bg-blue-500',
    };

    // Extract base color name from class if possible, or default to cyan
    const colorKey = visuals.color.replace('text-', '').split('-')[0];
    const themeClass = colorMap[colorKey] || colorMap.cyan;
    const baseColor = bgMap[colorKey] || 'bg-cyan-500';

    // Generate stable random values for animations using useMemo
    const randoms = React.useMemo(() => {
        // Simple deterministic pseudo-random based on string hash
        const hash = system.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const floatDuration = 3 + (hash % 20) / 10; // 3.0 to 5.0s

        // Generate values for vars
        const bars = Array.from({ length: 8 }).map((_, i) => ({
            bounce: 0.5 + ((hash + i) % 10) / 10,
            height: 20 + ((hash * i) % 80)
        }));

        return { floatDuration, bars };
    }, [system.id]);

    // Determine position for tooltip (Flip to left if on right side)
    const isRightSide = coordinates.x > 50;

    return (
        <div
            className={`absolute group/node cursor-pointer will-change-transform transition-all duration-500 
                ${isHovered ? 'z-40 scale-110' : 'z-10'} 
                ${isDimmed ? 'opacity-20 blur-[1px] scale-90 grayscale-[0.5]' : 'opacity-100'}
            `}
            style={{
                left: `${coordinates.x}%`,
                top: `${coordinates.y}%`,
                transform: 'translate(-50%, -50%)',
                animation: `float ${randoms.floatDuration}s ease-in-out infinite alternate`,
                animationPlayState: isHovered ? 'paused' : 'running'
            }}
            onMouseEnter={() => onHover(system)}
            onMouseLeave={onLeave}
            onClick={() => onClick(system)}
        >
            {/* Tactical Target Container */}
            <div className="relative flex items-center justify-center w-16 h-16">

                {/* 1. Rotating Outer Bracket (Active/Hover) */}
                <div className={`absolute inset-0 border border-dashed rounded-full border-white/20 opacity-0 group-hover/node:opacity-100 transition-all duration-500 group-hover/node:scale-100 scale-50 group-hover/node:animate-[spin_4s_linear_infinite] ${themeClass.replace('text-', 'border-')}`} />

                {/* 2. Corner Brackets (The "Reticle" look) */}
                <div className="absolute inset-2 opacity-20 group-hover/node:opacity-100 transition-all duration-300 group-hover/node:scale-100 scale-90">
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${themeClass.replace('text-', 'border-')}`} />
                    <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${themeClass.replace('text-', 'border-')}`} />
                    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${themeClass.replace('text-', 'border-')}`} />
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${themeClass.replace('text-', 'border-')}`} />
                </div>

                {/* 3. The Core Object (Star/Planet) */}
                <div className="relative flex items-center justify-center">

                    {/* Atmospheric Glow (Outer) */}
                    <div
                        className={`absolute inset-[-8px] rounded-full opacity-30 blur-md transition-all duration-700 ${baseColor}`}
                        style={{
                            animation: `pulsate ${visuals.pulse_rate || '3s'} ease-in-out infinite alternate-reverse`
                        }}
                    />

                    {/* Orbital Ring (Thin wireframe orbit) */}
                    <div className={`absolute inset-[-4px] rounded-full border border-white/10 opacity-60 w-[140%] h-[140%] left-[-20%] top-[-20%] animate-[spin_8s_linear_infinite]`} />

                    {/* Inner Pulse */}
                    <div
                        className={`absolute inset-0 rounded-full core-pulse ${baseColor}`}
                        style={{
                            filter: 'blur(4px)',
                            animation: `pulsate ${visuals.pulse_rate || '3s'} ease-in-out infinite`
                        }}
                    />

                    {/* Planetary Texture/Gradient Surface */}
                    <div
                        className={`
                            relative w-3 h-3 rounded-full shadow-inner ring-1 ring-white/20 z-10 
                            transition-all duration-300 group-hover/node:scale-125
                            ${baseColor}
                        `}
                        style={{
                            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 20%), var(--tw-bg-opacity, 1)`,
                            boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.5), 0 0 10px ${themeClass.includes('cyan') ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.3)'}`
                        }}
                    >
                        {/* Surface Detail (Crater/Storm) */}
                        <div className="absolute top-[20%] right-[30%] w-[40%] h-[40%] bg-black/10 rounded-full blur-[0.5px]" />
                    </div>
                </div>
            </div>

            {/* 4. Tactical Data Tag (Dynamic Positioning) */}
            <div
                className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/node:opacity-100 transition-all duration-300 z-20 flex items-center
                ${isRightSide ? 'right-full pr-3 flex-row-reverse' : 'left-full pl-3 flex-row'} 
                `}
            >
                {/* Connector Line */}
                <div className={`w-4 h-[1px] bg-cyan-500/50 ${isRightSide ? 'mr-1' : 'ml-1'}`} />

                <div className={`flex flex-col items-start bg-black/90 backdrop-blur-md border-cyan-500/50 px-3 py-2 min-w-[140px] shadow-xl
                    ${isRightSide ? 'border-r-2 rounded-l-md text-right items-end' : 'border-l-2 rounded-r-md text-left items-start'}
                `}>
                    <div className={`flex items-center gap-2 mb-1 ${isRightSide ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[10px] font-bold text-cyan-300 tracking-widest uppercase truncate max-w-[120px]">{spotifyData.trackTitle}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    </div>

                    <div className={`text-[9px] font-mono text-white/70 whitespace-nowrap flex items-center gap-2 mb-1 ${isRightSide ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="truncate max-w-[100px]">{spotifyData.album}</span>
                    </div>

                    <div className="text-[8px] font-mono text-cyan-500/60 flex justify-between w-full border-t border-white/10 pt-1 mt-1">
                        <span>{spotifyData.duration}</span>
                        <span>{spotifyData.bpm} BPM</span>
                        <span className="text-white/40">{spotifyData.key}</span>
                    </div>

                    {/* Fake Audio Visualizer Bars */}
                    <div className="flex gap-0.5 mt-2 h-3 items-end w-full justify-between opacity-80">
                        {randoms.bars.map((bar, i) => (
                            <div
                                key={i}
                                className={`w-1 rounded-t-sm ${baseColor}`}
                                style={{
                                    animation: `bounce ${bar.bounce}s infinite alternate`,
                                    height: `${bar.height}%`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});
