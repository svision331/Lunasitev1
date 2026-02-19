'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTimeUntil, type TimeUntil } from '@/lib/utils';

interface CountdownTimerProps {
    targetDate: string;
    // label?: string;
}

function CountdownDigit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                {/* Tech Box */}
                <div className="absolute inset-0 border border-cyan-500/30 rounded-sm skew-x-[-5deg]" />

                <motion.div
                    key={value}
                    className="relative px-3 py-2 sm:px-4 sm:py-3 min-w-[50px] sm:min-w-[80px] text-center overflow-hidden bg-black/40 backdrop-blur-md rounded-sm border-t border-white/10"
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-cyan-500/50" />
                    <span className="text-3xl sm:text-5xl font-bold font-mono text-cyan-50 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        {String(value).padStart(2, '0')}
                    </span>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-cyan-500/50" />
                </motion.div>
            </div>
            <span className="text-[10px] text-cyan-500/60 mt-2 uppercase tracking-[0.2em] font-mono">{label}</span>
        </div>
    );
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeUntil, setTimeUntil] = useState<TimeUntil>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        const updateCountdown = () => setTimeUntil(getTimeUntil(targetDate));
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (!mounted) return null;

    if (timeUntil.total <= 0) {
        return (
            <motion.div
                className="text-center py-8 border border-cyan-500/20 bg-cyan-500/5 rounded-sm"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <div className="text-xl font-bold text-cyan-400 font-mono tracking-widest animate-pulse">
                    {"/// TRANSMISSION ACTIVE ///"}
                </div>
                <div className="text-xs text-cyan-600 mt-2 uppercase tracking-[0.3em]">
                    Signal Locked
                </div>
            </motion.div>
        );
    }

    return (
        <div className="text-center">
            <div className="text-xs font-mono text-cyan-500/40 tracking-[0.5em] mb-4 uppercase">
                T-Minus Launch Sequence
            </div>
            <div className="flex justify-center gap-2 sm:gap-4 items-start">
                <CountdownDigit value={timeUntil.days} label="Days" />
                <div className="text-2xl sm:text-4xl font-bold text-cyan-500/30 self-center pb-6">:</div>
                <CountdownDigit value={timeUntil.hours} label="Hours" />
                <div className="text-2xl sm:text-4xl font-bold text-cyan-500/30 self-center pb-6">:</div>
                <CountdownDigit value={timeUntil.minutes} label="Mins" />
                <div className="text-2xl sm:text-4xl font-bold text-cyan-500/30 self-center pb-6">:</div>
                <CountdownDigit value={timeUntil.seconds} label="Secs" />
            </div>
        </div>
    );
}
