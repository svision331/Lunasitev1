import React from 'react';

export function GridBackground({
    opacity = 0.05,
    color = "rgba(0, 255, 255, 1)",
    size = 40
}: {
    opacity?: number;
    color?: string;
    size?: number;
}) {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
            {/* Dot Grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
                    backgroundSize: `${size}px ${size}px`
                }}
            />

            {/* Scanline Sweep */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scan-slow opacity-30" />
        </div>
    );
}
