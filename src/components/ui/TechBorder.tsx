'use client';

import React, { useRef, useEffect, useState } from 'react';

interface TechBorderProps {
    children: React.ReactNode;
    color?: "cyan" | "amber" | "pink" | "emerald";
    className?: string;
    cornerSize?: number;
    intensity?: "low" | "high";
}

export function TechBorder({
    children,
    color = "cyan",
    className = "",
    cornerSize = 12,
    intensity = "low"
}: TechBorderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        const observer = new ResizeObserver(updateDimensions);
        if (containerRef.current) observer.observe(containerRef.current);

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            observer.disconnect();
        };
    }, []);

    // Color mapping to new CSS variables
    const colorMap = {
        cyan: { border: "var(--primary)", glow: "var(--primary-glow)", bg: "rgba(6,182,212,0.05)" },
        amber: { border: "var(--accent)", glow: "#fbbf24", bg: "rgba(245,158,11,0.05)" },
        pink: { border: "var(--secondary)", glow: "#f472b6", bg: "rgba(236,72,153,0.05)" },
        emerald: { border: "#10b981", glow: "#34d399", bg: "rgba(16,185,129,0.05)" }
    };

    const current = colorMap[color];
    const { width, height } = dimensions;

    return (
        <div ref={containerRef} className={`relative group ${className}`}>
            {/* Outer Glow Border */}
            <div className={`absolute inset-0 transition-opacity duration-500`}
                style={{
                    border: `1px solid ${current.border}`,
                    opacity: intensity === 'high' ? 0.6 : 0.3,
                    boxShadow: intensity === 'high' ? `0 0 15px ${current.bg}` : 'none',
                    clipPath: `polygon(
                        0 0, 
                        ${cornerSize}px 0, 
                        0 ${cornerSize}px, 
                        0 calc(100% - ${cornerSize}px), 
                        ${cornerSize}px 100%, 
                        100% 100%, 
                        100% ${cornerSize}px, 
                        calc(100% - ${cornerSize}px) 0
                    )`
                }}
            />

            {/* Corner SVG Accents */}
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

                {/* Top Left Bracket */}
                <path d={`M 0 ${cornerSize} L 0 0 L ${cornerSize} 0`}
                    fill="none"
                    stroke={current.glow}
                    strokeWidth="2"
                    filter={`url(#glow-${color})`}
                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                />

                {/* Bottom Right Bracket */}
                <path d={`M ${width} ${height - cornerSize} L ${width} ${height} L ${width - cornerSize} ${height}`}
                    fill="none"
                    stroke={current.glow}
                    strokeWidth="2"
                    filter={`url(#glow-${color})`}
                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
            </svg>

            {/* Content Container */}
            <div className="relative backdrop-blur-sm p-1 h-full"
                style={{
                    backgroundColor: current.bg, // Subtle tint
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
                    )`
                }}>
                {children}
            </div>
        </div>
    );
}
