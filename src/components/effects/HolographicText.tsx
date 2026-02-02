'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface HolographicTextProps {
    text: string;
    className?: string;
}

const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*';

export function HolographicText({ text, className = '' }: HolographicTextProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [displayText, setDisplayText] = useState(text);
    const { playTyping } = useSoundEffects();

    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    })
                    .join('')
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3; // Speed of decoding
        }, 30);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => {
                setIsHovered(true);
                playTyping();
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Base Text */}
            <span className="relative z-10">{displayText}</span>

            {/* Cyan Offset */}
            <motion.span
                className="absolute inset-0 text-cyan-400 mix-blend-screen select-none pointer-events-none"
                animate={isHovered ? {
                    x: [-2, 2, -1, 0],
                    opacity: [0.5, 0.8, 0.5],
                } : { x: 0, opacity: 0 }}
                transition={{ duration: 0.2, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
            >
                {displayText}
            </motion.span>

            {/* Magenta Offset */}
            <motion.span
                className="absolute inset-0 text-fuchsia-500 mix-blend-screen select-none pointer-events-none"
                animate={isHovered ? {
                    x: [2, -2, 1, 0],
                    opacity: [0.5, 0.8, 0.5],
                } : { x: 0, opacity: 0 }}
                transition={{ duration: 0.25, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
            >
                {displayText}
            </motion.span>
        </div>
    );
}
