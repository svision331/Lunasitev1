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
            id: `SYS-${Date.now()}`,
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

    const removeSystem = (id: string) => {
        if(confirm('Are you sure you want to remove this star system from the lore?')) {
            setSystems(systems.filter(s => s.id !== id));
        }
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
                    <div key={sys.id} className="bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <input type="text" value={sys.name} onChange={(e) => updateSystem(sys.id, 'name', e.target.value)} className="bg-transparent border-b border-white/10 text-xl font-bold text-cyan-400 focus:border-cyan-400 outline-none w-1/2" />
                            <button onClick={() => removeSystem(sys.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Type</label>
                                <select value={sys.type} onChange={e => updateSystem(sys.id, 'type', e.target.value)} className="w-full bg-slate-800 rounded px-2 py-2 outline-none focus:ring-1 ring-cyan-500">
                                    <option value="star">Star</option>
                                    <option value="blackhole">Blackhole</option>
                                    <option value="nebula">Nebula</option>
                                    <option value="pulsar">Pulsar</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Real Location</label>
                                <input type="text" value={sys.location} onChange={e => updateSystem(sys.id, 'location', e.target.value)} className="w-full bg-slate-800 rounded px-2 py-1 outline-none focus:ring-1 ring-cyan-500" />
                            </div>
                            <div className="col-span-2 grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Nav X</label>
                                    <input type="number" value={sys.coordinates.x} onChange={e => updateSystem(sys.id, 'coordinates', {...sys.coordinates, x: parseFloat(e.target.value)||0})} className="w-full bg-slate-800 rounded px-2 py-1 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Nav Y</label>
                                    <input type="number" value={sys.coordinates.y} onChange={e => updateSystem(sys.id, 'coordinates', {...sys.coordinates, y: parseFloat(e.target.value)||0})} className="w-full bg-slate-800 rounded px-2 py-1 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Nav Z</label>
                                    <input type="number" value={sys.coordinates.z} onChange={e => updateSystem(sys.id, 'coordinates', {...sys.coordinates, z: parseFloat(e.target.value)||0})} className="w-full bg-slate-800 rounded px-2 py-1 outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-4 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-3">Spotify Sync Data</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-xs text-slate-600">Track</span>
                                    <input type="text" value={sys.spotifyData.trackTitle} onChange={e => updateSystem(sys.id, 'spotifyData', {...sys.spotifyData, trackTitle: e.target.value})} className="w-full bg-slate-800 rounded px-2 py-1 mt-1 outline-none" />
                                </div>
                                <div>
                                    <span className="text-xs text-slate-600">Album</span>
                                    <input type="text" value={sys.spotifyData.album} onChange={e => updateSystem(sys.id, 'spotifyData', {...sys.spotifyData, album: e.target.value})} className="w-full bg-slate-800 rounded px-2 py-1 mt-1 outline-none" />
                                </div>
                                <div>
                                    <span className="text-xs text-slate-600">BPM</span>
                                    <input type="text" value={sys.spotifyData.bpm} onChange={e => updateSystem(sys.id, 'spotifyData', {...sys.spotifyData, bpm: e.target.value})} className="w-full bg-slate-800 rounded px-2 py-1 mt-1 outline-none" />
                                </div>
                                <div>
                                    <span className="text-xs text-slate-600">Key</span>
                                    <input type="text" value={sys.spotifyData.key} onChange={e => updateSystem(sys.id, 'spotifyData', {...sys.spotifyData, key: e.target.value})} className="w-full bg-slate-800 rounded px-2 py-1 mt-1 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
