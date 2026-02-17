'use client';

import { HTMLMotionProps, motion, useMotionValue, useSpring } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface GlowButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export function GlowButton({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    'aria-label': ariaLabel,
    ...props
}: GlowButtonProps & { 'aria-label'?: string }) {
    const ref = useRef<HTMLButtonElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Magnetic Spring Physics
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Limit the pull distance
        x.set(mouseX * 0.15);
        y.set(mouseY * 0.15);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const baseStyles = 'relative font-semibold rounded-lg overflow-hidden transition-colors duration-300';

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const variantStyles = {
        primary: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] border border-cyan-400/20',
        secondary: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] border border-pink-400/20',
        outline: 'bg-transparent border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]',
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: xSpring, y: ySpring }}
            className={`
        ${baseStyles} 
        ${sizeStyles[size]} 
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
            aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        >
            {/* Gradient overlay on hover */}
            {variant === 'primary' && (
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
                {children}
            </span>
        </motion.button>
    );
}
