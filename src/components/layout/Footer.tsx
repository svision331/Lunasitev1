'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Music2, Twitter } from 'lucide-react';

const socialLinks = [
    { href: 'https://instagram.com/lunathelovegod', icon: Instagram, label: 'Instagram' },
    { href: 'https://youtube.com/@lunathelovegod', icon: Youtube, label: 'YouTube' },
    { href: 'https://open.spotify.com/artist/lunathelovegod', icon: Music2, label: 'Spotify' },
    { href: 'https://twitter.com/lunathelovegod', icon: Twitter, label: 'Twitter' },
];

const quickLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/refund', label: 'Refund Policy' },
    { href: '/accessibility', label: 'Accessibility' },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-700 pt-12 pb-24 md:pb-12 px-4 bg-black relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Connect */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold mb-4 text-lg font-display text-white">Connect</h3>
                        <div className="flex gap-4 justify-center md:justify-start">
                            {socialLinks.map((link) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-300 hover:text-cyan-400 transition-colors"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    aria-label={link.label}
                                >
                                    <link.icon size={24} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold mb-4 text-lg font-display text-white">Quick Links</h3>
                        <div className="space-y-2 text-sm text-slate-300">
                            {quickLinks.map((link) => (
                                <div key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-cyan-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold mb-4 text-lg font-display text-white">Booking</h3>
                        <a
                            href="mailto:booking@lunathelovegod.com"
                            className="text-sm text-slate-300 hover:text-cyan-400 transition-colors"
                        >
                            booking@lunathelovegod.com
                        </a>
                        <p className="text-xs text-slate-400 mt-2">
                            For press inquiries and collaborations
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="text-center text-sm text-slate-400 pt-8 border-t border-slate-700/50">
                    <p>© {currentYear} LUNATHELOVEGOD • Nebula Enterprises</p>
                    <p className="text-xs mt-2 text-slate-500">
                        Built with cosmic energy in NYC
                    </p>
                </div>
            </div>
        </footer>
    );
}
