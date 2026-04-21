'use client';

import { useState } from 'react';
import { Show } from '@/data/shows';
import { updateShowsAction } from '@/app/actions/shows';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';

interface Props {
    initialShows: Show[];
}

export function ShowManager({ initialShows }: Props) {
    const [shows, setShows] = useState<Show[]>(initialShows);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const addShow = () => {
        const newShow: Show = {
            id: `show-${Date.now()}`,
            type: 'Artist Show',
            title: 'New Event',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: '8:00 PM',
            venue: 'TBA',
            ticketsLeft: 100,
            price: 25,
            soldOut: false
        };
        setShows([newShow, ...shows]);
    };

    const removeShow = (id: string) => {
        if(confirm('Are you sure you want to remove this show?')) {
            setShows(shows.filter(s => s.id !== id));
        }
    };

    const updateShow = (id: string, field: keyof Show, value: any) => {
        setShows(shows.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        const res = await updateShowsAction(shows);
        setMessage(res.success ? 'Calendar updated successfully!' : (res.error || 'Failed to save'));
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-white/10 p-4 rounded-xl">
                <button
                    onClick={addShow}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 font-bold transition-colors"
                >
                    <Plus size={16} /> Add New Show
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-cyan-400 text-sm font-bold">{message}</span>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save All Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {shows.map((show) => (
                    <div key={show.id} className="bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <input 
                                type="text"
                                value={show.title}
                                onChange={(e) => updateShow(show.id, 'title', e.target.value)}
                                className="bg-transparent border-b border-white/10 text-xl font-bold text-cyan-400 focus:border-cyan-400 outline-none w-1/2"
                            />
                            <button onClick={() => removeShow(show.id)} className="text-red-400 hover:text-red-300">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Date</label>
                                <input type="text" value={show.date} onChange={e => updateShow(show.id, 'date', e.target.value)} className="w-full bg-slate-800 rounded px-2 py-1 outline-none focus:ring-1 ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Time</label>
                                <input type="text" value={show.time} onChange={e => updateShow(show.id, 'time', e.target.value)} className="w-full bg-slate-800 rounded px-2 py-1 outline-none focus:ring-1 ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Venue</label>
                                <input type="text" value={show.venue} onChange={e => updateShow(show.id, 'venue', e.target.value)} className="w-full bg-slate-800 rounded px-2 py-1 outline-none focus:ring-1 ring-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Tickets Left</label>
                                <input type="number" value={show.ticketsLeft} onChange={e => updateShow(show.id, 'ticketsLeft', parseInt(e.target.value)||0)} className="w-full bg-slate-800 rounded px-2 py-1 outline-none focus:ring-1 ring-cyan-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
