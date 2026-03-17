'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

export function CustomCursor() {
    const { settings } = useSettings();
    const [hidden, setHidden] = useState(true);
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const springConfigSlow = { damping: 30, stiffness: 200, mass: 1.5 };
    const cursorXSpringSlow = useSpring(cursorX, springConfigSlow);
    const cursorYSpringSlow = useSpring(cursorY, springConfigSlow);

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        // Apply cursor: none globally
        const style = document.createElement('style');
        style.innerHTML = `
          * { cursor: none !important; }
        `;
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

        // Detect hover on clickable elements
        const handleLinkHoverEvents = () => {
            const clickableElements = document.querySelectorAll('a, button, input-[type="submit"], input-[type="button"], [role="button"], [tabindex]:not([tabindex="-1"])');

            clickableElements.forEach((el) => {
                el.addEventListener('mouseenter', () => setLinkHovered(true));
                el.addEventListener('mouseleave', () => setLinkHovered(false));
            });
        };

        window.addEventListener('mousemove', moveMouse);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        // Call initially and setup a mutation observer to catch dynamically added elements
        handleLinkHoverEvents();
        const observer = new MutationObserver(() => {
            handleLinkHoverEvents();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.head.removeChild(style);
            window.removeEventListener('mousemove', moveMouse);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            observer.disconnect();
        };
    }, [cursorX, cursorY, hidden]);

    if (settings.reducedMotion) return null;

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
                    scale: clicked ? 0.7 : linkHovered ? 1.5 : 1,
                    backgroundColor: linkHovered ? '#f472b6' : '#22d3ee', // pink-400 : cyan-400
                    boxShadow: linkHovered
                        ? '0 0 15px 4px rgba(244, 114, 182, 0.6)'
                        : '0 0 10px 2px rgba(34, 211, 238, 0.5)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            />

            {/* Trailing Aura */}
            <motion.div
                className="absolute top-0 left-0 w-8 h-8 rounded-full pointer-events-none border border-cyan-400/30 backdrop-blur-[1px]"
                style={{
                    x: cursorXSpringSlow,
                    y: cursorYSpringSlow,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: clicked ? 1.5 : linkHovered ? 1.2 : 1,
                    borderColor: linkHovered ? 'rgba(244, 114, 182, 0.4)' : 'rgba(34, 211, 238, 0.3)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
        </div>
    );
}
