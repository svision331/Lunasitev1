'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Calendar, Star } from 'lucide-react';

const navItems = [
    { href: '#music', icon: Play, label: 'Music' },
    { href: '#live', icon: Calendar, label: 'Shows' },
    { href: '#join', icon: Star, label: 'Join' },
];

export function MobileNav() {
    return (
        <motion.div
            className="md:hidden fixed bottom-0 w-full bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 z-40"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
        >
            <div className="flex justify-around py-3 px-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              flex flex-col items-center gap-1 text-xs transition-colors
              ${item.active
                                ? 'text-cyan-400'
                                : 'text-slate-400 hover:text-slate-200'
                            }
            `}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* Safe area spacer for iOS */}
            <div className="h-[env(safe-area-inset-bottom)]" />
        </motion.div>
    );
}
