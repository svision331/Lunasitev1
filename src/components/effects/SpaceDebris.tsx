'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ShardData {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    duration: number;
    delay: number;
    depth: number;
}

const generateDebris = (count: number): ShardData[] =>
    Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        rotation: Math.random() * 360,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 5,
        depth: Math.random() * 0.5 + 0.1,
    }));

// Single scroll listener shared across all shards
function DebrisLayer({ shards }: { shards: ShardData[] }) {
    const { scrollY } = useScroll();

    return (
        <>
            {shards.map((shard) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const y = useTransform(scrollY, [0, 1000], [0, shard.depth * 300]);
                return (
                    <motion.div
                        key={shard.id}
                        style={{
                            left: `${shard.x}%`,
                            top: `${shard.y}%`,
                            width: shard.size,
                            height: shard.size,
                            y,
                            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        }}
                        className="absolute bg-gradient-to-tr from-cyan-500/10 to-transparent border border-white/5"
                        animate={{ rotate: [shard.rotation, shard.rotation + 360] }}
                        transition={{
                            duration: shard.duration,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: shard.delay,
                        }}
                    />
                );
            })}
        </>
    );
}

export function SpaceDebris() {
    const [debris, setDebris] = useState<ShardData[]>([]);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        // Reduced from 20 → 10 desktop, 8 → 4 mobile
        const timer = setTimeout(() => {
            setDebris(generateDebris(isMobile ? 4 : 10));
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!debris.length) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <DebrisLayer shards={debris} />
        </div>
    );
}
