'use client';

import { motion } from 'framer-motion';
import { Download, Mail, Play } from 'lucide-react';
import { GlowButton } from '@/components/ui';

export function Press() {
    return (
        <section id="press" className="section">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm text-slate-400 font-medium tracking-wider">
                        FOR VENUES & MEDIA
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-6 font-display text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">
                        BOOKING & PRESS
                    </h2>
                </motion.div>

                {/* Highlight Reel */}
                <motion.div
                    className="glass-card p-6 sm:p-8 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden group cursor-pointer">
                        {/* Background */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-500 group-hover:scale-105"
                            style={{
                                backgroundImage: 'url(https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=450&fit=crop)'
                            }}
                        />

                        {/* Play button */}
                        <motion.div
                            className="relative z-10 w-20 h-20 rounded-full bg-cyan-500/90 backdrop-blur flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play size={32} fill="currentColor" className="ml-1" />
                        </motion.div>

                        {/* Label */}
                        <div className="absolute bottom-4 left-4 right-4 text-left">
                            <span className="px-3 py-1 bg-slate-950/80 backdrop-blur rounded-full text-xs font-semibold text-cyan-400">
                                30 Second Highlight Reel
                            </span>
                        </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg sm:text-xl italic text-slate-300 mb-6 max-w-2xl mx-auto">
                        &ldquo;LUNATHELOVEGOD turns performances into immersive cosmic experiences that leave audiences transformed.&rdquo;
                    </blockquote>

                    <p className="text-sm text-slate-500">— Brooklyn Music Scene Magazine</p>
                </motion.div>

                {/* Press Stats */}
                <motion.div
                    className="grid sm:grid-cols-3 gap-4 mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {[
                        { value: '23', label: 'Sold Out Shows' },
                        { value: '1.2K+', label: 'Community Members' },
                        { value: '8', label: 'Cities' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass-card p-4">
                            <div className="text-2xl font-bold text-gradient font-display">{stat.value}</div>
                            <div className="text-xs text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <GlowButton size="lg">
                        <Download size={20} />
                        Download EPK (PDF)
                    </GlowButton>

                    <a href="mailto:booking@lunathelovegod.com">
                        <GlowButton variant="outline" size="lg">
                            <Mail size={20} />
                            booking@lunathelovegod.com
                        </GlowButton>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
