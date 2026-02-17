'use client';

import { motion } from 'framer-motion';

const themes = [
    {
        id: 'ice-giant',
        emoji: '🌙',
        name: 'Ice Giant Ball',
        subtitle: "Valentine's Edition",
        description: 'A frosty celebration of love and cosmic energy',
    },
    {
        id: 'solar-flare',
        emoji: '✨',
        name: 'Solar Flare',
        subtitle: 'Spring Equinox',
        description: 'Explosive beats and radiant vibes',
    },
    {
        id: 'nebula-drift',
        emoji: '🌊',
        name: 'Nebula Drift',
        subtitle: 'Summer Solstice',
        description: 'Floating through cosmic soundwaves',
    },
];

export function NebulaBash() {
    return (
        <section id="nebula-bash" className="section">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm text-pink-400 font-medium tracking-wider">
                        IMMERSIVE EXPERIENCES
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-6 font-display text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">
                        NEBULA BASH
                    </h2>
                    <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
                        Themed nightclub experiences where cosmic energy meets NYC nightlife.
                        Every Bash is a portal to a different universe.
                    </p>
                </motion.div>

                {/* Theme Cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {themes.map((theme, i) => (
                        <motion.div
                            key={theme.id}
                            className="glass-card p-6 text-center group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <motion.div
                                className="text-4xl mb-3"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                {theme.emoji}
                            </motion.div>
                            <h3 className="font-bold text-xl font-display text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                                {theme.name}
                            </h3>
                            <p className="text-sm text-cyan-400 mb-2">{theme.subtitle}</p>
                            <p className="text-xs text-slate-500">{theme.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-sm text-slate-400 mb-4">
                        Secret locations revealed 24 hours before. Space Invaders get early access.
                    </p>
                    <a
                        href="#join"
                        className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4"
                    >
                        Become a Space Invader →
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
