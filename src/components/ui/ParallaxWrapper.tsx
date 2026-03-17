'use client';

import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

interface ParallaxWrapperProps {
    children: ReactNode;
    /** The amount of parallax offset. Positive values move slower (pull up), negative values move faster (push down). */
    offset?: number;
    className?: string;
}

export function ParallaxWrapper({ children, offset = 50, className = '' }: ParallaxWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { settings } = useSettings();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'] // When top of element hits bottom of viewport, to when bottom of element hits top of viewport
    });

    // Apply parallax. For example, [-100, 100] means it moves from 100px up to 100px down relative to its normal position over the scroll range.
    const rawY = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
    
    // Add spring physics for smoother movement (especially on trackpads/scroll wheels)
    const y = useSpring(rawY, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Disable parallax if user prefers reduced motion
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
