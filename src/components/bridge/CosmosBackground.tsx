import React from 'react';
import { COSMOS_SYSTEMS } from '@/data/cosmos';

interface CosmosBackgroundProps {
    isPaused: boolean;
}

export const CosmosBackground = React.memo(function CosmosBackground({ isPaused }: CosmosBackgroundProps) {
    const animationState = isPaused ? 'paused' : 'running';

    return (
        <>
            {/* 1. Deep Space Background Layers - Optimized for Performance */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-black to-black" />

            {/* Animated Starfield Layers (Twinkling + Moving) - BRIGHTER & FASTER */}

            {/* Layer 1: Distant Stars */}
            <div
                className="absolute inset-[20%] opacity-60 animate-[spin_120s_linear_infinite] will-change-transform"
                style={{
                    backgroundImage: 'radial-gradient(white 2px, transparent 2px)',
                    backgroundSize: '90px 90px',
                    animationPlayState: animationState
                }}
            />

            {/* Layer 2: Closer Stars - More varied size */}
            <div
                className="absolute inset-0 opacity-40 animate-[spin_90s_linear_infinite_reverse] will-change-transform"
                style={{
                    backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px), radial-gradient(#22d3ee 1px, transparent 1px)',
                    backgroundSize: '110px 110px',
                    backgroundPosition: '0 0, 55px 55px',
                    animationPlayState: animationState
                }}
            />

            {/* Layer 3: Rapid Twinkle overlay - CSS only, no heavy JS */}
            <div className="absolute inset-0 bg-transparent animate-pulse opacity-30 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(cyan 1px, transparent 1px)',
                    backgroundSize: '70px 70px',
                    animationDuration: '3s'
                }}
            />

            {/* 2. Tactical Sector Grid (SVG) - Reduced opacity for performance perception */}
            <div className="absolute inset-0 opacity-20 pointer-events-none will-change-transform">
                <svg width="100%" height="100%">
                    <defs>
                        <pattern id="sector-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="cyan" strokeWidth="0.5" strokeOpacity="0.3" />
                            <circle cx="100" cy="100" r="1" fill="white" fillOpacity="0.5" />
                        </pattern>
                        <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="cyan" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    {/* Main Grid */}
                    <rect width="100%" height="100%" fill="url(#sector-grid)" />

                    {/* Radar Sweep Effect */}
                    <rect width="100%" height="100%" fill="url(#radar-gradient)" className="animate-[spin_4s_linear_infinite] origin-center opacity-30" style={{ mixBlendMode: 'overlay' }} />

                    <defs>
                        <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="45%" stopColor="transparent" />
                            <stop offset="50%" stopColor="cyan" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>

                    {/* Polar Coordinates / Radar Rings */}
                    <circle cx="50%" cy="50%" r="20%" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="50%" cy="50%" r="35%" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="8 4" />

                    {/* Flight Paths (Connection Lines) */}
                    {COSMOS_SYSTEMS.map((system, i) => {
                        const next = COSMOS_SYSTEMS[(i + 1) % COSMOS_SYSTEMS.length];
                        return (
                            <g key={`path-${i}`}>
                                <path
                                    d={`M ${system.coordinates.x}% ${system.coordinates.y}% L ${next.coordinates.x}% ${next.coordinates.y}%`}
                                    stroke="url(#path-gradient)"
                                    strokeWidth="1"
                                    fill="none"
                                    strokeDasharray="5 5"
                                    className="opacity-40 animate-pulse"
                                />
                                {/* Moving Data Packet on Line */}
                                <circle r="1.5" fill="white">
                                    <animateMotion
                                        dur={`${3 + i}s`}
                                        repeatCount="indefinite"
                                        path={`M ${system.coordinates.x}% ${system.coordinates.y}% L ${next.coordinates.x}% ${next.coordinates.y}%`}
                                    />
                                </circle>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* 3. Sector Labels (Static UI Overlay) */}
            <div className="absolute top-4 left-4 text-[10px] text-cyan-500/40 tracking-[0.3em] font-bold">SECTOR 7G {'//'} ALPHA QUADRANT</div>
            <div className="absolute top-4 right-4 text-[10px] text-cyan-500/40 tracking-[0.3em] font-bold">GRID_REF: X-99</div>
            <div className="absolute bottom-4 left-4 text-[10px] text-cyan-500/40 tracking-[0.3em] font-bold">STATUS: SECURE</div>
        </>
    );
});
