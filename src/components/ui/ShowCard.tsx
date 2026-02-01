'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Shield } from 'lucide-react';
import { GlowButton } from './GlowButton';
import type { Show } from '@/data/shows';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface ShowCardProps {
    show: Show;
    index: number;
}

export function ShowCard({ show, index }: ShowCardProps) {
    const { playHover, playClick } = useSoundEffects();

    const urgencyColor = show.ticketsLeft <= 30
        ? 'text-orange-400'
        : show.ticketsLeft <= 100
            ? 'text-yellow-400'
            : 'text-emerald-400';

    return (
        <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseEnter={playHover}
        >
            {/* Holographic Background */}
            <div className="absolute inset-0 bg-cyan-950/20 backdrop-blur-sm border border-cyan-500/20 clip-path-slant group-hover:border-cyan-500/40 transition-colors" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }} />

            {/* Scanning Laser */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/50 opacity-0 group-hover:opacity-100 group-hover:animate-scan transition-opacity pointer-events-none" />

            <div className="relative p-8" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
                {/* ID Badge */}
                <div className="absolute top-4 right-4 text-[9px] font-mono text-cyan-500/40 border border-cyan-500/20 px-2 py-0.5 rounded-sm">
                    MSN_LOG_0{index + 1}
                </div>

                {/* Theme banner */}
                {show.theme && (
                    <div className="inline-block mb-4">
                        <div className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold tracking-widest text-cyan-200">
                            OPERATION: {show.theme.toUpperCase()}
                        </div>
                    </div>
                )}

                {/* Title */}
                <h3 className="text-2xl font-bold mb-2 font-display text-white group-hover:text-cyan-200 transition-colors uppercase tracking-tight">
                    {show.title}
                </h3>

                {/* Type badge */}
                <div className="text-[10px] text-cyan-500 font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Shield size={12} />
                    {show.type}
                </div>

                {/* Details */}
                <div className="space-y-4 text-sm text-slate-300 mb-8 border-l border-white/10 pl-4">
                    <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-cyan-400 flex-shrink-0" />
                        <span className="font-mono text-cyan-100">{show.date} <span className="text-slate-500">|</span> {show.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-cyan-400 flex-shrink-0" />
                        <span>
                            {show.venue}
                            {show.type === 'Nebula Bash' && (
                                <span className="block text-[10px] text-pink-400 mt-1 uppercase tracking-wider font-mono">
                                    {'// PRECISE COORDS CLASSIFIED'}
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Urgency indicator */}
                <div className="flex items-center justify-between mb-8 bg-black/20 p-3 rounded-sm border border-white/5">
                    <div className="flex items-center gap-2">
                        <Ticket size={16} className={urgencyColor} />
                        <span className={`font-mono text-xs uppercase tracking-wider ${urgencyColor}`}>
                            {show.soldOut ? 'MISSION FULL' : `${show.ticketsLeft} SEATS OPEN`}
                        </span>
                    </div>
                    <span className="text-cyan-400 font-mono text-lg">
                        ${show.price}
                    </span>
                </div>

                {/* CTA */}
                <div onClick={playClick}>
                    <GlowButton
                        fullWidth
                        disabled={show.soldOut}
                        className={show.soldOut ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                    >
                        {show.soldOut ? 'ACCESS DENIED' : 'ENGAGE MISSION'}
                    </GlowButton>
                </div>
            </div>
        </motion.div>
    );
}
