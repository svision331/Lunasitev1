import React from 'react';

interface TechBorderProps {
    children: React.ReactNode;
    color?: "cyan" | "amber" | "pink" | "emerald";
    className?: string;
    cornerSize?: number;
}

export function TechBorder({
    children,
    color = "cyan",
    className = "",
    cornerSize = 12
}: TechBorderProps) {

    const colors = {
        cyan: "border-cyan-500/30 text-cyan-400 bg-cyan-950/10",
        amber: "border-amber-500/30 text-amber-400 bg-amber-950/10",
        pink: "border-pink-500/30 text-pink-400 bg-pink-950/10",
        emerald: "border-emerald-500/30 text-emerald-400 bg-emerald-950/10"
    };

    const accentColor = {
        cyan: "#22d3ee",
        amber: "#fbbf24",
        pink: "#f472b6",
        emerald: "#34d399"
    }[color];

    return (
        <div className={`relative group ${className}`}>
            {/* Outer Border with Gap */}
            <div className={`absolute inset-0 border ${colors[color]} opacity-40`}
                style={{
                    clipPath: `polygon(
             0 0, 
             ${cornerSize}px 0, 
             0 ${cornerSize}px, 
             0 calc(100% - ${cornerSize}px), 
             ${cornerSize}px 100%, 
             100% 100%, 
             100% ${cornerSize}px, 
             calc(100% - ${cornerSize}px) 0
           )`}}
            />

            {/* Corner Brackets */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                    <filter id={`glow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Top Left */}
                <path d={`M 0 ${cornerSize} L 0 0 L ${cornerSize} 0`}
                    fill="none" stroke={accentColor} strokeWidth="2"
                    filter={`url(#glow-${color})`}
                />

                {/* Top Right Connector */}
                <path d={`M calc(100% - ${cornerSize}) 0 L 100% ${cornerSize}`}
                    fill="none" stroke={accentColor} strokeWidth="1" opacity="0.5"
                />

                {/* Bottom Left Connector */}
                <path d={`M 0 calc(100% - ${cornerSize}) L ${cornerSize} 100%`}
                    fill="none" stroke={accentColor} strokeWidth="1" opacity="0.5"
                />

                {/* Bottom Right */}
                <path d={`M 100% calc(100% - ${cornerSize}) L 100% 100% L calc(100% - ${cornerSize}) 100%`}
                    fill="none" stroke={accentColor} strokeWidth="2"
                    filter={`url(#glow-${color})`}
                />

                {/* Decorative Specs */}
                <circle cx="4" cy="calc(100% - 4)" r="1" fill={accentColor} />
                <circle cx="calc(100% - 4)" cy="4" r="1" fill={accentColor} />
            </svg>

            {/* Content Container */}
            <div className={`relative ${colors[color]} backdrop-blur-sm p-1`}
                style={{
                    clipPath: `polygon(
             0 0, 
             ${cornerSize}px 0, 
             0 ${cornerSize}px, 
             0 calc(100% - ${cornerSize}px), 
             ${cornerSize}px 100%, 
             calc(100% - ${cornerSize}px) 100%,
             100% calc(100% - ${cornerSize}px),
             100% ${cornerSize}px,
             calc(100% - ${cornerSize}px) 0
           )`}}>
                {children}
            </div>
        </div>
    );
}
