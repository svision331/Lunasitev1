'use client';

import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

interface ParallaxWrapperProps {
    children: ReactNode;
    offset?: number;
    className?: string;
}

export function ParallaxWrapper({ children, offset = 50, className = '' }: ParallaxWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { settings } = useSettings();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // Direct transform — removed useSpring to save physics CPU across 8 simultaneous instances
    const y = useTransform(scrollYProgress, [0, 1], [-offset * 0.5, offset * 0.5]);

    if (settings?.reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div ref={ref} className={`relative ${className}`}>
            <motion.div style={{ y }} className="w-full h-full relative z-10">
                {children}
            </motion.div>
        </div>
    );
}
