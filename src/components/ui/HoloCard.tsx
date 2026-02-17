'use client';

import React from 'react';

interface HoloCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'active' | 'locked';
}

export function HoloCard({ children, className = '', variant = 'default' }: HoloCardProps) {
    const variants = {
        default: "glass-card border-white/5 hover:border-cyan-500/40 hover:shadow-[var(--shadow-glow-cyan)]",
        active: "bg-cyan-950/30 border-cyan-500/60 shadow-[var(--shadow-glow-cyan)] backdrop-blur-xl",
        locked: "bg-black/60 border-white/5 opacity-50 grayscale"
    };

    return (
        <div className={`
            relative rounded-xl backdrop-blur-md border transition-all duration-300
            ${variants[variant]}
            ${className}
        `}>
            {/* Scanline texture overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
