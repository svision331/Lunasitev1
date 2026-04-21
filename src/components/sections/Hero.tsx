'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Users } from 'lucide-react';
import { GlowButton } from '@/components/ui';
import { NebulaGradient, HolographicText, SpaceDebris } from '@/components/effects';
import { communityStats } from '@/data/membership';

export function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 300]); // Deeper Parallax effect

    return (
        <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16 pb-24 md:pb-0">
            {/* Base Background Image (Fallback) */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/images/hero-bg-v2.jpg)',
                    y, // GPU optimized parallax
                    scaleX: -1
                }}
            />

            {/* Zero-G Floating Debris */}
            <SpaceDebris />

            {/* Video Background (Optional Override) */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-lighten z-[1]"
            >
                <source src="/videos/hero-loop.mp4" type="video/mp4" />
            </video>

            {/* Nebula Gradient Overlay */}
            <NebulaGradient />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-slate-950/60" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* Welcome Badge */}
                <motion.div
                    className="text-sm tracking-widest text-cyan-400 mb-4 font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    WELCOME SPACE INVADERS
                </motion.div>

                {/* Title */}
                <motion.div
                    className="mb-4 relative"
                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight font-display leading-[1.1] sm:leading-none">
                        <HolographicText text="LUNA" /><span className="text-gradient inline-block hover:scale-105 transition-transform duration-500">THELOVEGOD</span>
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-2 font-mono tracking-wide"
                    initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    Ice Giant Lover Girl — Live from NYC
                </motion.p>

                <motion.p
                    className="text-sm text-slate-400 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Atlanta-born artist building cosmic experience of Love. Sound. and Vibration.
                </motion.p>

                {/* Social Proof */}
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <span className="flex items-center gap-2">
                        <Users size={16} className="text-cyan-400" />
                        {communityStats.spaceInvaders.toLocaleString()}+ Space Invaders
                    </span>
                    <span className="hidden sm:block">•</span>
                    <span>Last show sold out in {communityStats.averageSelloutTime}</span>
                </motion.div>

                {/* CTAs */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-8 px-4 sm:px-0"
                    initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <a href="#live" className="w-full sm:w-auto">
                        <GlowButton size="lg" className="w-full sm:w-auto">
                            Enter Nebula Bash
                        </GlowButton>
                    </a>
                    <a href="#join" className="w-full sm:w-auto">
                        <GlowButton variant="outline" size="lg" className="w-full sm:w-auto">
                            <div className="text-center">
                                <span>Join Space Invaders</span>
                                <div className="text-xs text-slate-400 mt-1">Early tickets + secret sets</div>
                            </div>
                        </GlowButton>
                    </a>
                </motion.div>

                {/* Scroll indicator removed to reduce clutter */}
            </div>
        </section>
    );
}
