'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Node {
    id: string;
    label: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    active?: boolean;
}

interface StarmapNavProps {
    activeId: string;
    onNavigate: (id: string) => void;
}

export function StarmapNav({ activeId, onNavigate }: StarmapNavProps) {
    const nodes: Node[] = [
        { id: 'HOME', label: 'Bridge', x: 50, y: 50 },
        { id: 'MISSION', label: 'Mission', x: 20, y: 30 },
        { id: 'MEDIA', label: 'Archives', x: 80, y: 30 },
        { id: 'COMMS', label: 'Comms', x: 50, y: 80 },
    ];

    return (
        <div className="relative w-full h-64 md:h-full min-h-[200px] border border-white/5 rounded-xl bg-black/40 overflow-hidden group">
            {/* Background Grid - Subtle Rotation */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-[-50%] w-[200%] h-[200%] bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_translateZ(-200px)] animate-[spin_60s_linear_infinite]" />
            </div>

            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {nodes.map((node) => {
                    // Draw lines to center (Bridge)
                    if (node.id === 'HOME') return null;
                    return (
                        <motion.line
                            key={`line-${node.id}`}
                            x1={`${node.x}%`} y1={`${node.y}%`}
                            x2="50%" y2="50%"
                            stroke="rgba(6, 182, 212, 0.3)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            animate={{ strokeDashoffset: [0, -8] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    );
                })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
                const isActive = activeId === node.id;
                return (
                    <motion.button
                        key={node.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 p-4" // Added padding for touch target
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        onClick={() => onNavigate(node.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Navigate to ${node.label}`}
                    >
                        {/* Node Circle */}
                        <div className={`
                            w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-300 relative
                            ${isActive ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_20px_var(--primary)] scale-125' : 'bg-black/80 border-white/20 group-hover:border-cyan-500/50 group-hover:bg-cyan-900/40'}
                        `}>
                            {isActive && (
                                <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400 opacity-75 duration-1000" />
                            )}
                            {/* Connecting Pulse */}
                            <motion.div
                                className="absolute inset-0 rounded-full border border-cyan-500/30"
                                initial={{ scale: 1, opacity: 0 }}
                                animate={{ scale: 2.5, opacity: [0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            />
                        </div>

                        {/* Label */}
                        <div className={`
                            absolute top-8 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors font-mono
                            ${isActive ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-white/30 group-hover:text-white/90'}
                        `}>
                            {node.label}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
