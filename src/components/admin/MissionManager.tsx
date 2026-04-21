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
            id: `m-${Date.now()}`,
            title: 'New Event',
            description: 'Event description',
            status: 'ACTIVE',
            reward: 'Bonus'
        };
        setMissions([newMission, ...missions]);
    };

    const removeMission = (id: string) => {
        if(confirm('Are you sure you want to remove this event?')) {
            setMissions(missions.filter(m => m.id !== id));
        }
    };

    const updateMission = (id: string, field: keyof Mission, value: any) => {
        setMissions(missions.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        const res = await updateMissionsAction(missions);
        setMessage(res.success ? 'Events updated!' : (res.error || 'Failed to save'));
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-white/10 p-4 rounded-xl">
                <button onClick={addMission} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 font-bold transition-colors">
                    <Plus size={16} /> Add New Event
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-cyan-400 text-sm font-bold">{message}</span>
                    <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors disabled:opacity-50">
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save All Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {missions.map((mission) => (
                    <div key={mission.id} className="bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <input type="text" value={mission.title} onChange={(e) => updateMission(mission.id, 'title', e.target.value)} className="bg-transparent border-b border-white/10 text-xl font-bold text-cyan-400 focus:border-cyan-400 outline-none w-1/2" />
                            <button onClick={() => removeMission(mission.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Status</label>
                                <select value={mission.status} onChange={e => updateMission(mission.id, 'status', e.target.value)} className="w-full bg-slate-800 rounded px-2 py-2 outline-none focus:ring-1 ring-cyan-500">
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="LOCKED">LOCKED</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Reward</label>
                                <input type="text" value={mission.reward} onChange={e => updateMission(mission.id, 'reward', e.target.value)} className="w-full bg-slate-800 rounded px-2 py-1 outline-none focus:ring-1 ring-cyan-500" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Description</label>
                                <textarea value={mission.description} onChange={e => updateMission(mission.id, 'description', e.target.value)} className="w-full bg-slate-800 rounded px-2 py-2 outline-none focus:ring-1 ring-cyan-500 h-20" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
