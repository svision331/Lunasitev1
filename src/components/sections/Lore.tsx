'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { loreChapters } from '@/data/membership';

export function Lore() {
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
    const [isFullyExpanded, setIsFullyExpanded] = useState(false);

    const toggleChapter = (id: string) => {
        setExpandedChapter(expandedChapter === id ? null : id);
    };

    return (
        <section id="lore" className="section">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm text-purple-400 font-medium tracking-wider">
                        THE ORIGIN STORY
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4 font-display text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">
                        COSMIC LORE
                    </h2>
                    <p className="text-lg text-slate-300">
                        The journey from Atlanta to the cosmos
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-400 opacity-30" />

                    {/* Chapters */}
                    <div className="space-y-8">
                        {loreChapters.slice(0, isFullyExpanded ? undefined : 2).map((chapter, i) => (
                            <motion.div
                                key={chapter.id}
                                className={`relative pl-12 sm:pl-0 ${i % 2 === 0 ? 'sm:pr-[52%]' : 'sm:pl-[52%]'}`}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                {/* Timeline dot */}
                                <div className={`
                  absolute left-2 sm:left-1/2 top-0 w-4 h-4 rounded-full 
                  bg-gradient-to-r from-cyan-400 to-purple-400
                  transform sm:-translate-x-1/2
                  ring-4 ring-slate-950
                `} />

                                {/* Card */}
                                <div
                                    className="glass-card p-6 cursor-pointer"
                                    onClick={() => toggleChapter(chapter.id)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="text-xs text-cyan-400 font-medium">{chapter.year}</span>
                                            <h3 className="font-bold text-xl font-display text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                                                {chapter.title}
                                            </h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: expandedChapter === chapter.id ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown size={20} className="text-slate-400" />
                                        </motion.div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedChapter === chapter.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-slate-400 text-sm leading-relaxed pt-2 border-t border-slate-800 mt-2">
                                                    {chapter.content}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {expandedChapter !== chapter.id && (
                                        <p className="text-slate-300 text-sm line-clamp-2">
                                            {chapter.content}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Expand button */}
                    {!isFullyExpanded && loreChapters.length > 2 && (
                        <motion.div
                            className="text-center mt-8"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <button
                                onClick={() => setIsFullyExpanded(true)}
                                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 mx-auto"
                            >
                                <span>Read full origin story</span>
                                <ChevronDown size={16} />
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
