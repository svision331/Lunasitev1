'use client';

import { useState } from 'react';
import { updateSettingsAction } from '@/app/actions/settings';
import { GlobalSettings } from '@/lib/storage';
import { Loader2, Save, Globe, Shield, Users, Server, Radio } from 'lucide-react';
import { TechBorder } from '@/components/ui/TechBorder';
import { HoloCard } from '@/components/ui/HoloCard';

interface Props {
    initialSettings: GlobalSettings;
}

export function AdminSettings({ initialSettings }: Props) {
    const [settings, setSettings] = useState<GlobalSettings>(initialSettings);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    async function handleSave() {
        setIsLoading(true);
        setMessage('');
        const res = await updateSettingsAction(settings);
        if (res.success) {
            setMessage('Configuration Matrix Updated');
        } else {
            setMessage(res.error || 'Sync Failed');
        }
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    }

    return (
        <TechBorder color="amber" intensity="high" cornerSize={24} className="w-full">
            <div className="bg-black/90 p-8 flex flex-col font-mono relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                     style={{ backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="relative z-10">
                    <header className="mb-10 flex items-center justify-between border-b border-cyan-500/20 pb-6">
                        <div className="flex items-center gap-4">
                            <Server className="text-cyan-400 animate-pulse" size={28} />
                            <div>
                                <h2 className="text-3xl font-bold font-display tracking-widest text-white glow-text uppercase">
                                    Global Config
                                </h2>
                                <div className="text-xs tracking-[0.3em] text-cyan-500 mt-1 uppercase">
                                    Bridge Master Override
                                </div>
                            </div>
                        </div>
                        {message && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/50 rounded text-emerald-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                                <Radio size={14} />
                                {message}
                            </div>
                        )}
                    </header>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Core Identifiers */}
                        <HoloCard variant="default" className="p-6 space-y-6 !border-cyan-500/30">
                            <div className="flex items-center gap-2 text-cyan-400 mb-4 border-b border-cyan-500/20 pb-2">
                                <Globe size={16} />
                                <span className="text-xs uppercase tracking-widest font-bold">Network Identity</span>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Project Classification (Site Title)</label>
                                <input 
                                    type="text" 
                                    value={settings.siteTitle}
                                    onChange={e => setSettings({...settings, siteTitle: e.target.value})}
                                    className="w-full bg-black/50 border border-cyan-500/30 rounded p-4 text-white text-lg font-display focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] outline-none transition-all"
                                />
                            </div>
                        </HoloCard>

                        {/* Security Parameters */}
                        <HoloCard variant="locked" className="p-6 space-y-6">
                            <div className="flex items-center gap-2 text-yellow-400 mb-4 border-b border-yellow-500/20 pb-2">
                                <Shield size={16} />
                                <span className="text-xs uppercase tracking-widest font-bold">Security & Access</span>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <div className="font-bold text-white tracking-widest uppercase text-sm">Lockdown Mode</div>
                                    <div className="text-[10px] text-slate-400 mt-1 tracking-widest uppercase">Restrict non-admin grid access</div>
                                </div>
                                <button 
                                    onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                                    className={`w-14 h-7 rounded-full transition-all relative border ${settings.maintenanceMode ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'bg-black border-slate-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-7 bg-yellow-400' : 'translate-x-0 bg-slate-500'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <div className="font-bold text-white tracking-widest uppercase text-sm">Open Registration</div>
                                    <div className="text-[10px] text-slate-400 mt-1 tracking-widest uppercase">Allow new crew deployments</div>
                                </div>
                                <button 
                                    onClick={() => setSettings({...settings, registrationEnabled: !settings.registrationEnabled})}
                                    className={`w-14 h-7 rounded-full transition-all relative border ${settings.registrationEnabled ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'bg-black border-slate-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${settings.registrationEnabled ? 'translate-x-7 bg-cyan-400' : 'translate-x-0 bg-slate-500'}`} />
                                </button>
                            </div>
                        </HoloCard>

                        {/* Resource Allocation */}
                        <HoloCard variant="default" className="p-6 md:col-span-2 !border-cyan-500/30">
                            <div className="flex items-center gap-2 text-cyan-400 mb-4 border-b border-cyan-500/20 pb-2">
                                <Users size={16} />
                                <span className="text-xs uppercase tracking-widest font-bold">Resource Allocation</span>
                            </div>

                            <div className="w-1/2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Maximum Crew Capacity (Limit)</label>
                                <input 
                                    type="number" 
                                    value={settings.maxUsers}
                                    onChange={e => setSettings({...settings, maxUsers: parseInt(e.target.value) || 1000})}
                                    className="w-full bg-black/50 border border-cyan-500/30 rounded p-4 text-white text-xl font-bold font-mono focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] outline-none transition-all"
                                />
                            </div>
                        </HoloCard>
                    </div>

                    <div className="mt-10 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="group flex items-center gap-3 px-8 py-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 hover:border-cyan-400 rounded text-cyan-400 font-bold transition-all disabled:opacity-50 uppercase tracking-[0.2em]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="group-hover:scale-110 transition-transform" />}
                            Commit Configuration
                        </button>
                    </div>
                </div>
            </div>
        </TechBorder>
    );
}
