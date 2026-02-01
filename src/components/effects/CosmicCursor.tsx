'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CosmicCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16);
            mouseY.set(e.clientY - 16);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [mouseX, mouseY]);

    return (
        <>
            {/* UFO Cursor */}
            <motion.div
                ref={cursorRef}
                className="fixed pointer-events-none z-50 w-12 h-12 hidden md:flex items-center justify-center mix-blend-screen"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.6))',
                }}
            >
                <motion.div
                    className="relative w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    {/* SVG UFO */}
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="domeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(165, 243, 252, 0.9)" />
                                <stop offset="100%" stopColor="rgba(34, 211, 238, 0.2)" />
                            </linearGradient>
                            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#cffaf9" />
                                <stop offset="50%" stopColor="#22d3ee" />
                                <stop offset="100%" stopColor="#0891b2" />
                            </linearGradient>
                        </defs>

                        {/* Tractor Beam Glow (Bottom) */}
                        <ellipse cx="50" cy="65" rx="15" ry="5" fill="cyan" opacity="0.3" filter="blur(5px)" />

                        {/* Main Body */}
                        <ellipse cx="50" cy="50" rx="45" ry="12" fill="url(#bodyGrad)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

                        {/* Dome */}
                        <path d="M 30 50 A 20 20 0 0 1 70 50" fill="url(#domeGrad)" stroke="white" strokeWidth="0.5" opacity="0.8" />

                        {/* Rim Lights */}
                        <g className="animate-[spin_4s_linear_infinite] origin-center">
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                                <circle
                                    key={i}
                                    cx={50 + 35 * Math.cos(deg * Math.PI / 180)}
                                    cy={50 + 6 * Math.sin(deg * Math.PI / 180)}
                                    r="2"
                                    fill="white"
                                    className="animate-pulse"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </g>

                        {/* Top Antenna */}
                        <line x1="50" y1="30" x2="50" y2="20" stroke="white" strokeWidth="1" />
                        <circle cx="50" cy="20" r="2" fill="red" className="animate-ping" />
                    </svg>
                </motion.div>
            </motion.div>
        </>
    );
}
