'use client';

import { motion } from 'framer-motion';
import { upcomingShows, getNextShow } from '@/data/shows';
import { ShowCard, CountdownTimer } from '@/components/ui';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { fetchShows } from '@/app/actions/fetchers';
import { useState, useEffect } from 'react';
import { Show } from '@/data/shows';

export function LiveShows() {
    const [shows, setShows] = useState<Show[]>(upcomingShows);
    const { playHover, playClick } = useSoundEffects();

    useEffect(() => {
        fetchShows().then(res => {
            if (res && res.length) setShows(res);
        });
    }, []);

    const now = new Date();
    const futureShows = shows.filter(s => new Date(s.date) > now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const nextShow = futureShows[0] || null;

    return (
        <section id="live" className="section bg-slate-950/50">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onMouseEnter={playHover}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] tracking-widest uppercase text-cyan-200 font-mono">Incoming Transmission</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 relative inline-block">
                        NEBULA BASH TRANSMISSIONS
                        <div className="absolute -right-4 top-0 text-[8px] md:text-[10px] text-cyan-500 font-mono opacity-50">V4.0</div>
                    </h2>
                </motion.div>

                {/* Countdown to next show */}
                {nextShow && (
                    <motion.div
                        className="mb-16 relative group max-w-3xl mx-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />

                        <div className="relative glass-card p-8 md:p-12 text-center border border-cyan-500/20" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
                            {/* Decorative corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-cyan-500/50" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-cyan-500/50" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-cyan-500/50" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-cyan-500/50" />

                            <h3 className="text-xs text-cyan-400 font-mono tracking-[0.3em] uppercase mb-4">
                                Target Coordinates Locked
                            </h3>
                            <p className="text-2xl md:text-4xl font-bold mb-8 font-display text-white">
                                {nextShow.title}
                            </p>
                            <div onMouseEnter={playHover}>
                                <CountdownTimer targetDate={nextShow.date} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Show Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {shows.map((show, i) => (
                        <ShowCard key={show.id} show={show} index={i} />
                    ))}
                </div>

                {/* View all shows link */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <a
                        href="#"
                        onClick={playClick}
                        onMouseEnter={playHover}
                        className="inline-block px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-sm text-slate-300 transition-all uppercase tracking-widest font-mono rounded-sm"
                    >
                        [ Access Full Archives ]
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
