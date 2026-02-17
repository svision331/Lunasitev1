'use client';

import React, { useState } from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'radioactive';
    glitch?: boolean;
    children: React.ReactNode;
}

export function CyberButton({
    variant = 'primary',
    glitch = true,
    className = '',
    children,
    ...props
}: CyberButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    const baseStyles = "relative px-8 py-3 font-display font-bold uppercase tracking-widest text-sm transition-all duration-300 overflow-hidden group cursor-pointer";

    const variants = {
        primary: "text-black bg-cyan-400 hover:bg-cyan-300 clip-path-cyber",
        secondary: "text-cyan-400 border border-cyan-500/50 hover:bg-cyan-950/30 hover:border-cyan-400 clip-path-cyber",
        danger: "text-pink-400 border border-pink-500/50 hover:bg-pink-950/30 hover:border-pink-400 clip-path-cyber",
        ghost: "text-white/40 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 clip-path-cyber",
        radioactive: "text-cyan-100 btn-radioactive clip-path-cyber"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className} [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {/* Background Glitch Effect */}
            {glitch && isHovered && (
                <div className="absolute inset-0 bg-white/10 translate-x-1 mix-blend-overlay animate-pulse" />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {glitch && isHovered && <span className="text-xs opacity-50">&gt;</span>}
                {children}
            </span>

            {/* Corner Accents */}
            <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-all duration-300 ${variant === 'primary' ? 'border-black' : 'border-current'} opacity-50`} />
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-all duration-300 ${variant === 'primary' ? 'border-black' : 'border-current'} opacity-50`} />
        </button>
    );
}
