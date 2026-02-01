import React from 'react';

import type { LucideIcon } from 'lucide-react';

export function StatCard({ label, value, trend, icon: Icon }: { label: string; value: string; trend?: string; icon: LucideIcon }) {
    return (
        <div className="panel p-4 flex flex-col justify-between group hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-400/30 transition-colors">
                    <Icon size={14} className="text-cyan-400" />
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
    );
}
