'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { membershipTiers } from '@/data/membership';
import { TierCard, GlowButton } from '@/components/ui';

export function Membership() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setEmail('');

        // Reset after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <section id="join" className="section section-alt">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-sm text-cyan-400 font-medium tracking-wider">
                        JOIN THE COMMUNITY
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4 font-display text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">
                        ICE GIANTS
                    </h2>
                    <p className="text-lg text-slate-300">
                        This isn&apos;t a newsletter. It&apos;s access.
                    </p>
                </motion.div>

                {/* Tier Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {membershipTiers.map((tier, i) => (
                        <TierCard key={tier.id} tier={tier} index={i} />
                    ))}
                </div>

                {/* Signup Form */}
                <motion.div
                    className="relative overflow-hidden p-8 group"
                    style={{ clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)' }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {/* Dark Card Background */}
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />

                    {/* Tech Grid */}
                    <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-10 bg-[size:30px_30px] animate-[pulse_10s_linear_infinite]" />

                    {/* Holographic Border */}
                    <div className="absolute inset-0 border border-cyan-500/30 z-20 pointer-events-none transition-colors duration-500 group-hover:border-cyan-400/60"
                        style={{ clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)' }}
                    />

                    {/* Corner Accents */}
                    <div className="absolute top-0 right-0 w-12 h-1 bg-gradient-to-l from-cyan-400 to-transparent z-30" />
                    <div className="absolute top-0 right-0 w-1 h-12 bg-gradient-to-b from-cyan-400 to-transparent z-30" />
                    <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-pink-500 to-transparent z-30" />
                    <div className="absolute bottom-0 left-0 w-1 h-12 bg-gradient-to-t from-pink-500 to-transparent z-30" />

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-2 text-center font-display tracking-tight text-white glitch-text" data-text="GET YOUR ICE GIANT ID">
                            GET YOUR ICE GIANT ID
                        </h3>
                        <p className="text-center text-cyan-400/60 font-mono text-xs tracking-widest uppercase mb-8">
                            Join the Nebula // Access Granted
                        </p>

                        {isSubmitted ? (
                            <motion.div
                                className="text-center py-8"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <div className="text-5xl mb-6 animate-bounce">🚀</div>
                                <h4 className="text-xl font-bold text-gradient mb-2 uppercase tracking-widest">Signal Received</h4>
                                <p className="text-slate-400 font-mono text-sm">Check your inbox for encryption keys.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                                <div className="relative group/input">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg blur opacity-20 group-hover/input:opacity-50 transition duration-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ENTER_COMM_LINK_ID (EMAIL)"
                                        className="relative w-full px-4 py-4 bg-black border border-slate-800 text-white placeholder:text-slate-600 font-mono text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all uppercase tracking-wider"
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                                        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                                        <div className="w-1 h-1 bg-pink-500 rounded-full animate-pulse delay-75" />
                                    </div>
                                </div>

                                <GlowButton
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2 font-mono uppercase tracking-widest">
                                            <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                            Encrypting...
                                        </span>
                                    ) : (
                                        <span className="font-mono uppercase tracking-[0.2em] font-bold">INITIALIZE LINK</span>
                                    )}
                                </GlowButton>

                                <p className="text-[10px] text-slate-600 text-center font-mono uppercase tracking-wider">
                                    Secure Connection // One-Tap Disconnect // Cosmic Data Only
                                </p>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
