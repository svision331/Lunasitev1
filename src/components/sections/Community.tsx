'use client';

import { motion } from 'framer-motion';
import { Instagram, Star, Heart, Radio } from 'lucide-react';
import Image from 'next/image';
import { communityStats } from '@/data/membership';
import { useSoundEffects } from '@/hooks/useSoundEffects';

// Mock community photos (in production, these would come from Instagram API)
const communityPhotos = [
    { id: 1, src: '/images/gallery/gallery-01.jpg', likes: 234 },
    { id: 2, src: '/images/gallery/gallery-02.jpg', likes: 189 },
    { id: 3, src: '/images/gallery/gallery-03.jpg', likes: 312 },
    { id: 4, src: '/images/gallery/gallery-04.jpg', likes: 156 },
    { id: 5, src: '/images/gallery/gallery-05.jpg', likes: 278 },
    // Reusing the first one for the 6th slot to keep grid balanced, or we could add another later
    { id: 6, src: '/images/gallery/gallery-06.jpg', likes: 421 },
];

const featuredInvader = {
    name: 'MOINTHECITY',
    avatar: '/images/top-contributor.jpg',
    showsAttended: 12,
    quote: 'Every Nebula Bash feels like coming home to another dimension. This community is family.',
};

export function Community() {
    const { playHover, playClick } = useSoundEffects();

    return (
        <section id="community" className="section section-alt relative overflow-hidden">
            {/* Tech Background */}
            <div className="absolute inset-0 bg-slate-950" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md mb-4 animate-pulse-slow">
                        <Radio size={12} className="text-pink-400" />
                        <span className="text-[10px] text-pink-300 font-mono tracking-widest uppercase">
                            LIVE_TRANSMISSION_FEED
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-display tracking-tight text-white glitch-text" data-text="ICE GIANT GALLERY">
                        ICE GIANT GALLERY
                    </h2>
                    <p className="text-lg text-slate-400 font-mono text-xs tracking-wider uppercase">
                        Shot by the community // Uploading...
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {[
                        { label: 'Ice Giants', value: communityStats.spaceInvaders.toLocaleString() },
                        { label: 'Shows Sold Out', value: communityStats.showsSoldOut },
                        { label: 'Avg Sellout', value: communityStats.averageSelloutTime },
                        { label: 'Cities Reached', value: communityStats.citiesReached },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center p-4 relative group hover:bg-white/5 transition-colors duration-300"
                            onMouseEnter={playHover}
                        >
                            {/* Tech Borders */}
                            <div className="absolute inset-0 border border-white/10 group-hover:border-cyan-500/30 transition-colors" />
                            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-500/50" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyan-500/50" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyan-500/50" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-500/50" />

                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display group-hover:text-cyan-200 transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Photo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-16 px-2">
                    {communityPhotos.map((photo, i) => (
                        <motion.div
                            key={photo.id}
                            className="group relative aspect-square overflow-hidden cursor-pointer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            onMouseEnter={playHover}
                            onClick={playClick}
                        >
                            <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/50 z-20 transition-colors duration-300 pointer-events-none" />

                            <Image
                                src={photo.src}
                                alt="Community photo"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />

                            {/* HUD Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-white font-mono text-[10px] uppercase tracking-wider mb-1">
                                            <span className="text-cyan-400">IMG_0{photo.id}</span> {'// UPLOADED'}
                                        </p>
                                        <p className="text-slate-400 text-xs">@space_invader</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-pink-400 text-xs font-mono">
                                        <Heart className="w-3 h-3 fill-pink-400" /> {photo.likes}
                                    </div>
                                </div>
                            </div>

                            {/* Scanline */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-0 group-hover:opacity-20 pointer-events-none z-10" />
                        </motion.div>
                    ))}
                </div>

                {/* Featured Space Invader */}
                <motion.div
                    className="relative max-w-2xl mx-auto text-center p-8 border-y border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-4">
                        <div className="flex items-center gap-2 text-[10px] text-yellow-500 font-mono tracking-[0.3em] uppercase">
                            <Star size={12} fill="currentColor" />
                            TOP_CONTRIBUTOR
                            <Star size={12} fill="currentColor" />
                        </div>
                    </div>

                    <div className="relative w-24 h-24 mx-auto mb-6 group">
                        <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[spin_10s_linear_infinite_reverse] scale-110" />
                        <Image
                            src={featuredInvader.avatar}
                            alt={featuredInvader.name}
                            fill
                            className="rounded-full object-cover p-1"
                        />
                    </div>

                    <h4 className="font-bold text-2xl font-display text-white mb-2">{featuredInvader.name}</h4>
                    <p className="text-xs font-mono text-cyan-400 mb-6 tracking-wider uppercase">
                        Access Level: {featuredInvader.showsAttended} Shows // VETERAN status
                    </p>

                    <blockquote className="text-slate-300 italic max-w-lg mx-auto leading-relaxed">
                        &ldquo;{featuredInvader.quote}&rdquo;
                    </blockquote>
                </motion.div>

                {/* Instagram CTA */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <a
                        href="https://instagram.com/lunathelovegod"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 rounded-full hover:bg-white/5 hover:border-pink-500/50 hover:text-pink-400 transition-all duration-300 group"
                        onMouseEnter={playHover}
                        onClick={playClick}
                    >
                        <Instagram size={16} />
                        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 group-hover:text-pink-300 transition-colors">
                            Transmission Link // Instagram
                        </span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
