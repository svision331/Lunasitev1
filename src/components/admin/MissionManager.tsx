'use client';

import { useState } from 'react';
import { Mission } from '@/data/missions';
import { updateMissionsAction } from '@/app/actions/missions';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';

interface Props {
    initialMissions: Mission[];
}

export function MissionManager({ initialMissions }: Props) {
    const [missions, setMissions] = useState<Mission[]>(initialMissions);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const addMission = () => {
        const newMission: Mission = {
            id: `m-${crypto.randomUUID()}`,
            title: 'New Mission',
            description: 'Mission description',
            status: 'ACTIVE',
            reward: 'Bonus',
            link: '',
            actionLabel: 'Connect'
        };
        setMissions([newMission, ...missions]);
    };

    const removeMission = async (id: string) => {
        const updatedMissions = missions.filter(m => m.id !== id);
        setMissions(updatedMissions);
        
        setIsLoading(true);
        const res = await updateMissionsAction(updatedMissions);
        setMessage(res.success ? 'Mission deleted!' : 'Failed to delete');
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateMission = (id: string, field: keyof Mission, value: any) => {
        setMissions(missions.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        const res = await updateMissionsAction(missions);
        setMessage(res.success ? 'Missions updated!' : (res.error || 'Failed to save'));
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-white/10 p-4 rounded-xl">
                <button onClick={addMission} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 font-bold transition-colors">
                    <Plus size={16} /> Add New Mission
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-cyan-400 text-sm font-bold">{message}</span>
                    <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors disabled:opacity-50">
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save All Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {missions.map((mission) => (
                    <div key={mission.id} className="bg-slate-900 border border-white/10 rounded-xl p-6 flex flex-col gap-6 relative group">
                        <button 
                            onClick={() => removeMission(mission.id)} 
                            className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg z-50"
                            title="Delete Mission"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Mission Title</label>
                                    <input type="text" value={mission.title} onChange={(e) => updateMission(mission.id, 'title', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-xl font-bold text-cyan-400 focus:border-cyan-400 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Status</label>
                                        <select value={mission.status} onChange={e => updateMission(mission.id, 'status', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400">
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="LOCKED">LOCKED</option>
                                            <option value="COMPLETED">COMPLETED</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Reward</label>
                                        <input type="text" value={mission.reward} onChange={e => updateMission(mission.id, 'reward', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">External Link (Optional)</label>
                                    <input type="text" value={mission.link || ''} onChange={e => updateMission(mission.id, 'link', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Button Label</label>
                                    <input type="text" value={mission.actionLabel || ''} onChange={e => updateMission(mission.id, 'actionLabel', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" placeholder="Connect / Stream / etc" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Description</label>
                            <textarea value={mission.description} onChange={e => updateMission(mission.id, 'description', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-400 h-20 resize-none" placeholder="Explain the mission..." />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
