'use client';

import { motion } from 'framer-motion';
import type { MembershipTier } from '@/data/membership';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface TierCardProps {
    tier: MembershipTier;
    index: number;
}

export function TierCard({ tier, index }: TierCardProps) {
    const { playHover, playClick } = useSoundEffects();

    const glowMap: Record<string, string> = {
        slate: 'hover:shadow-[0_0_30px_rgba(100,116,139,0.4)]',
        cyan: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]',
        purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]',
        pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]',
    };

    return (
        <motion.div
            className={`
                relative p-6 group cursor-pointer
                glass-card
                ${glowMap[tier.color] || glowMap.slate}
            `}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseEnter={playHover}
            onClick={playClick}
        >
            {/* Tech Grid Background - subtle overlay on top of glass */}
            <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-5 bg-[size:20px_20px] pointer-events-none mix-blend-overlay" />

            {/* Icon */}
            <div className={`text-3xl mb-4 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${tier.color === 'cyan' ? 'text-cyan-400 drop-shadow-[0_0_10px_cyan]' : 'text-slate-200'}`}>
                {tier.icon}
            </div>

            {/* Tier label */}
            <div className={`text-xs font-mono tracking-[0.2em] mb-2 uppercase ${tier.color === 'cyan' ? 'text-cyan-400' : 'text-slate-500'}`}>
                {tier.tier} <span className="opacity-50 mx-2">{'//'}</span> LEVEL {index + 1}
            </div>

            {/* Name */}
            <h4 className="font-bold text-xl mb-3 font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:from-white group-hover:to-cyan-200 transition-all">
                {tier.name}
            </h4>

            {/* Unlock description */}
            <div className="relative z-10">
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {tier.unlock}
                </p>
            </div>

            {/* Decorative corner gradient */}
            <div
                className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at top right, var(--nebula-${tier.color === 'slate' ? 'cyan' : tier.color}), transparent 70%)`,
                }}
            />
        </motion.div>
    );
}
