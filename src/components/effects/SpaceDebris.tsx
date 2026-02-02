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

// Random shard generation
const generateDebris = (count: number): ShardData[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        rotation: Math.random() * 360,
        duration: Math.random() * 20 + 20, // Slower for more "floaty" feel
        delay: Math.random() * 5,
        depth: Math.random() * 0.5 + 0.1, // Parallax depth
    }));
};

function DebrisShard({ shard }: { shard: ShardData }) {
    const { scrollY } = useScroll();
    // distinct parallax for each shard based on its depth
    const y = useTransform(scrollY, [0, 1000], [0, shard.depth * 300]);

    return (
        <motion.div
            style={{
                left: `${shard.x}%`,
                top: `${shard.y}%`,
                width: shard.size,
                height: shard.size,
                y,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Move to style prop to avoid CSS file for now, but valid here
            }}
            className="absolute bg-gradient-to-tr from-cyan-500/10 to-transparent border border-white/5 backdrop-blur-[1px]"
            animate={{
                rotate: [shard.rotation, shard.rotation + 360],
                y: [0, -20, 0], // Gentle float independent of parallax
            }}
            transition={{
                duration: shard.duration,
                repeat: Infinity,
                ease: "linear",
                delay: shard.delay,
            }}
        />
    );
}

export function SpaceDebris() {
    const [debris, setDebris] = useState<ShardData[]>([]);

    useEffect(() => {
        setDebris(generateDebris(20));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {debris.map((shard) => (
                <DebrisShard key={shard.id} shard={shard} />
            ))}
        </div>
    );
}
