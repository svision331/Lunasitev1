import React from 'react';

import type { LucideIcon } from 'lucide-react';

import { TechBorder } from '@/components/ui/TechBorder';
import { GridBackground } from '@/components/effects/GridBackground';

export function StatCard({ label, value, trend, icon: Icon }: { label: string; value: string; trend?: string; icon: LucideIcon }) {
    return (
        <TechBorder className="group hover:bg-white/5 transition-colors" color="cyan" cornerSize={8}>
            <div className="p-4 bg-black/60 relative overflow-hidden h-full flex flex-col justify-between">
                <GridBackground opacity={0.05} />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            {/* Icon Ring Effect */}
                            <div className="absolute inset-0 rounded-lg border border-cyan-500/30 group-hover:border-cyan-400/80 transition-colors shadow-[0_0_10px_rgba(34,211,238,0.1)]" />
                            <Icon size={14} className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        {trend && (
                            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                {trend}
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="text-[10px] tracking-widest uppercase text-white/50 mb-0.5">{label}</div>
                        <div className="text-xl font-bold text-white/90 font-display tracking-tight">{value}</div>
                    </div>
                </div>
            </div>
        </TechBorder>
    );
}
