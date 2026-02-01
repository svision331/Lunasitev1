'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

interface NebulaGradientProps {
    className?: string;
}

export function NebulaGradient({ className }: NebulaGradientProps) {
    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 1000], [0, 200]);
    const deepParallaxY = useTransform(scrollY, [0, 1000], [0, 100]);

    return (
        <div className={`absolute inset-0 pointer-events-none ${className || ''}`}>
            {/* Deep static background */}
            <div className="absolute inset-0 bg-slate-950/20" />

            {/* Slow moving deep layer */}
            <motion.div
                className="absolute inset-0"
                style={{
                    y: deepParallaxY,
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                linear-gradient(
                  180deg,
                  rgba(19, 10, 40, 0.4) 0%,
                  transparent 40%,
                  transparent 80%,
                  rgba(10, 20, 40, 0.4) 100%
                )
              `,
                    }}
                />
            </motion.div>

            {/* Main parallax layer */}
            <motion.div
                className="absolute inset-0"
                style={{
                    y: parallaxY,
                }}
            >
                {/* Primary gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
              linear-gradient(
                180deg,
                rgba(236, 72, 153, 0.1) 0%,
                transparent 30%,
                transparent 70%,
                rgba(34, 211, 238, 0.1) 100%
              )
            `,
                    }}
                />

                {/* Radial accent - top left */}
                <div
                    className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 60%)',
                        filter: 'blur(120px)',
                    }}
                />

                {/* Radial accent - bottom right */}
                <div
                    className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4), transparent 60%)',
                        filter: 'blur(120px)',
                    }}
                />
            </motion.div>
        </div>
    );
}
