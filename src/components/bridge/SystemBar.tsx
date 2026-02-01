import React from 'react';

import type { LucideIcon } from 'lucide-react';

export function SystemBar({ label, value, icon: Icon }: { label: string; value: number; icon?: LucideIcon }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] tracking-widest uppercase text-white/60">
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={12} className="text-cyan-400" />}
                    <span>{label}</span>
                </div>
                <span className="text-white/80 font-mono">{value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 glowbar transition-all duration-700 ease-out"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
