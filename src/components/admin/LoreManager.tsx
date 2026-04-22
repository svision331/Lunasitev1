'use client';

import { useState } from 'react';
import { StarSystem } from '@/data/cosmos';
import { updateCosmosAction } from '@/app/actions/cosmos';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';

interface Props {
    initialCosmos: StarSystem[];
}

export function LoreManager({ initialCosmos }: Props) {
    const [systems, setSystems] = useState<StarSystem[]>(initialCosmos);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const addSystem = () => {
        const newSystem: StarSystem = {
            id: `SYS-${crypto.randomUUID()}`,
            name: 'New Unknown System',
            type: 'star',
            coordinates: { x: 50, y: 50, z: 0 },
            location: 'Deep Space',
            metrics: { radius: '1.0 Solar', temperature: '5,000 K', mass: '1.0 M☉', luminosity: '1.0 L☉' },
            visuals: { color: 'text-white', core_size: 'w-4 h-4', glow_intensity: 'shadow-[0_0_15px_rgba(255,255,255,0.5)]', pulse_rate: '2s' },
            spotifyData: { trackTitle: 'Silence', album: 'Unknown', streams: '0', duration: '0:00', bpm: '0', key: 'C' }
        };
        setSystems([newSystem, ...systems]);
    };

    const removeSystem = async (id: string) => {
        const updatedSystems = systems.filter(s => s.id !== id);
        setSystems(updatedSystems);
        
        setIsLoading(true);
        const res = await updateCosmosAction(updatedSystems);
        setMessage(res.success ? 'System deleted!' : 'Failed to delete');
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const updateSystem = (id: string, field: keyof StarSystem, value: any) => {
        setSystems(systems.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        const res = await updateCosmosAction(systems);
        setMessage(res.success ? 'Lore updated!' : (res.error || 'Failed to save'));
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-white/10 p-4 rounded-xl">
                <button onClick={addSystem} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 font-bold transition-colors">
                    <Plus size={16} /> Add Star System
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
                {systems.map((sys) => (
                    <div key={sys.id} className="bg-slate-900 border border-white/10 rounded-xl p-6 flex flex-col gap-6 relative group">
                        <button 
                            onClick={() => removeSystem(sys.id)} 
                            className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg z-50"
                            title="Delete Star System"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">System Name</label>
                                    <input type="text" value={sys.name} onChange={(e) => updateSystem(sys.id, 'name', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-xl font-bold text-cyan-400 focus:border-cyan-400 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Type</label>
                                        <select value={sys.type} onChange={e => updateSystem(sys.id, 'type', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400">
                                            <option value="star">Star</option>
                                            <option value="blackhole">Blackhole</option>
                                            <option value="nebula">Nebula</option>
                                            <option value="pulsar">Pulsar</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Real Location</label>
                                        <input type="text" value={sys.location} onChange={e => updateSystem(sys.id, 'location', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 flex-1">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Nav X</label>
                                    <input type="number" value={sys.coordinates.x} onChange={e => updateSystem(sys.id, 'coordinates', {...sys.coordinates, x: parseFloat(e.target.value)||0})} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Nav Y</label>
                                    <input type="number" value={sys.coordinates.y} onChange={e => updateSystem(sys.id, 'coordinates', {...sys.coordinates, y: parseFloat(e.target.value)||0})} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Nav Z</label>
                                    <input type="number" value={sys.coordinates.z} onChange={e => updateSystem(sys.id, 'coordinates', {...sys.coordinates, z: parseFloat(e.target.value)||0})} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-4">
                            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-3">Spotify Sync Data</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <span className="text-[10px] text-slate-600 uppercase">Track</span>
                                    <input type="text" value={sys.spotifyData.trackTitle} onChange={e => updateSystem(sys.id, 'spotifyData', {...sys.spotifyData, trackTitle: e.target.value})} className="w-full bg-slate-800 border border-white/5 rounded px-2 py-1 mt-1 text-sm text-white outline-none" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-600 uppercase">Album</span>
                                    <input type="text" value={sys.spotifyData.album} onChange={e => updateSystem(sys.id, 'spotifyData', {...sys.spotifyData, album: e.target.value})} className="w-full bg-slate-800 border border-white/5 rounded px-2 py-1 mt-1 text-sm text-white outline-none" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-600 uppercase">BPM</span>
                                    <input type="text" value={sys.spotifyData.bpm} onChange={e => updateSystem(sys.id, 'spotifyData', {...sys.spotifyData, bpm: e.target.value})} className="w-full bg-slate-800 border border-white/5 rounded px-2 py-1 mt-1 text-sm text-white outline-none" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-600 uppercase">Key</span>
                                    <input type="text" value={sys.spotifyData.key} onChange={e => updateSystem(sys.id, 'spotifyData', {...sys.spotifyData, key: e.target.value})} className="w-full bg-slate-800 border border-white/5 rounded px-2 py-1 mt-1 text-sm text-white outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
