import React, { useState } from "react";
import { CheckCircle2, Circle, Lock, ArrowRight, ShieldCheck, Trophy } from "lucide-react";
import { MISSIONS, Mission } from "@/data/missions";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { fetchMissions } from "@/app/actions/fetchers";
import { useEffect } from "react";

interface MissionLogProps {
    onClose: () => void;
}

export function MissionLog({ onClose }: MissionLogProps) {
    const [missions, setMissions] = useState<Mission[]>(MISSIONS);
    const [completedCount, setCompletedCount] = useState(0);
    const { playClick, playSuccess } = useSoundEffects();

    useEffect(() => {
        fetchMissions().then(res => {
            if (res && res.length) setMissions(res);
        });
    }, []);

    const handleAction = (mission: Mission) => {
        if (mission.status === 'LOCKED') return;

        playClick();

        if (mission.link) {
            window.open(mission.link, '_blank');
        }

        // Simulate completion for active missions
        if (mission.status === 'ACTIVE') {
            playSuccess();
            setMissions(prev => prev.map(m =>
                m.id === mission.id ? { ...m, status: 'COMPLETED' } : m
            ));
            setCompletedCount(prev => prev + 1);
        }
    };

    const progress = (completedCount / missions.filter(m => m.status !== 'LOCKED').length) * 100;

    return (
        <div className="w-full h-full flex flex-col p-6 relative overflow-hidden panel rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-cyan-400">
                    <ShieldCheck size={18} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <span className="text-sm tracking-[0.2em] font-bold uppercase text-glow">Mission Log</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-white/40">SYNC STATUS</span>
                    <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <div
                            className="h-full bg-cyan-400 shadow-[0_0_10px_cyan] transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-cyan-400">{Math.round(progress)}%</span>
                        <div className="w-px h-3 bg-white/20 mx-2" />
                        <button
                            onClick={onClose}
                            className="flex items-center gap-1 hover:text-red-400 transition-colors uppercase"
                        >
                            <span className="text-red-500/80">[ End Transmission ]</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mission List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                {missions.map((mission) => (
                    <div
                        key={mission.id}
                        className={`
                            relative group glass rounded-xl p-4 transition-all duration-300
                            ${mission.status === 'LOCKED'
                                ? 'opacity-50 grayscale cursor-not-allowed'
                                : 'hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]'}
                            ${mission.status === 'COMPLETED' ? '!border-emerald-500/30 !bg-emerald-950/20' : ''}
                        `}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`pt-1 ${mission.status === 'COMPLETED' ? 'text-emerald-400' :
                                    mission.status === 'LOCKED' ? 'text-white/20' : 'text-cyan-400'
                                    }`}>
                                    {mission.status === 'COMPLETED' ? <CheckCircle2 size={20} /> :
                                        mission.status === 'LOCKED' ? <Lock size={20} /> :
                                            <Circle size={20} />}
                                </div>
                                <div>
                                    <h3 className={`font-bold uppercase tracking-wider text-sm mb-1 ${mission.status === 'COMPLETED' ? 'text-emerald-100 line-through opacity-70' :
                                        mission.status === 'LOCKED' ? 'text-white/40' : 'text-white'
                                        }`}>
                                        {mission.title}
                                    </h3>
                                    <p className="text-xs text-white/60 font-mono leading-relaxed max-w-[280px]">
                                        {mission.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/20 text-white/40 border border-white/5">
                                    {mission.reward}
                                </span>
                                {mission.status !== 'COMPLETED' && mission.status !== 'LOCKED' && (
                                    <button
                                        onClick={() => handleAction(mission)}
                                        className="flex items-center gap-1 text-[10px] uppercase font-bold text-cyan-400 hover:text-cyan-200 transition-colors mt-2"
                                    >
                                        {mission.actionLabel || 'Engage'} <ArrowRight size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30 font-mono uppercase tracking-widest">
                <span>Current Rewards: {completedCount * 100} XP</span>
                <span className="flex items-center gap-1"><Trophy size={10} /> Rank: Explorer</span>
            </div>
        </div>
    );
}
