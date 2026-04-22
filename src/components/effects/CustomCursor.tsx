'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import { usePathname } from 'next/navigation';

export function CustomCursor() {
    const { settings } = useSettings();
    const pathname = usePathname();
    const [hidden, setHidden] = useState(true);
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);

    const isAdminPage = pathname?.startsWith('/admin');

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Tightened spring configs for a snappier feel
    const springConfig = { damping: 20, stiffness: 800, mass: 0.1 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const springConfigSlow = { damping: 25, stiffness: 350, mass: 0.4 };
    const cursorXSpringSlow = useSpring(cursorX, springConfigSlow);
    const cursorYSpringSlow = useSpring(cursorY, springConfigSlow);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Only apply cursor: none on non-admin pages
        if (isAdminPage) {
            // Ensure native cursor is restored on admin pages
            document.documentElement.style.cursor = '';
            document.body.style.cursor = '';
            return;
        }

        // Apply cursor: none globally on public pages
        const style = document.createElement('style');
        style.innerHTML = `* { cursor: none !important; }`;
        document.head.appendChild(style);

        const moveMouse = (e: MouseEvent) => {
            if (hidden) setHidden(false);
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseLeave = () => setHidden(true);
        const handleMouseEnter = () => setHidden(false);
        const handleMouseDown = () => setClicked(true);
        const handleMouseUp = () => setClicked(false);

        // Optimized event delegation for hover detection
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable = target?.closest('a, button, [role="button"], input, select, textarea');
            setLinkHovered(!!isClickable);
        };

        window.addEventListener('mousemove', moveMouse, { passive: true });
        window.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            if (document.head.contains(style)) document.head.removeChild(style);
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [cursorX, cursorY, hidden, isAdminPage]);

    // Don't render custom cursor on admin pages or with reduced motion
    if (settings.reducedMotion || isAdminPage) return null;

    return (
        <div className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'}`}>
            {/* Main Cursor Dot */}
            <motion.div
                className="absolute top-0 left-0 w-3 h-3 bg-cyan-400 rounded-full mix-blend-screen pointer-events-none"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: clicked ? 0.7 : linkHovered ? 1.8 : 1,
                    backgroundColor: linkHovered ? '#f472b6' : '#22d3ee',
                }}
            />

            {/* Trailing Aura */}
            <motion.div
                className="absolute top-0 left-0 w-8 h-8 rounded-full pointer-events-none border border-cyan-400/30 backdrop-blur-[1px]"
                style={{
                    x: cursorXSpringSlow,
                    y: cursorYSpringSlow,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: clicked ? 1.5 : linkHovered ? 1.4 : 1,
                    borderColor: linkHovered ? 'rgba(244, 114, 182, 0.4)' : 'rgba(34, 211, 238, 0.3)',
                }}
            />
        </div>
    );
}

