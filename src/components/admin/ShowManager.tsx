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
            id: `show-${crypto.randomUUID()}`,
            type: 'Artist Show',
            title: 'New Event',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: '8:00 PM',
            venue: 'TBA',
            ticketsLeft: 100,
            price: 25,
            soldOut: false,
            description: '',
            theme: ''
        };
        setShows([newShow, ...shows]);
    };

    const removeShow = async (id: string) => {
        const updatedShows = shows.filter(s => s.id !== id);
        setShows(updatedShows);
        
        setIsLoading(true);
        const res = await updateShowsAction(updatedShows);
        setMessage(res.success ? 'Event deleted!' : 'Failed to delete');
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
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

            <div className="grid grid-cols-1 gap-6">
                {shows.map((show) => (
                    <div key={show.id} className="bg-slate-900 border border-white/10 rounded-xl p-6 flex flex-col gap-6 relative group">
                        <button 
                            onClick={() => removeShow(show.id)} 
                            className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg z-50"
                            title="Delete Event"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Event Title</label>
                                    <input 
                                        type="text"
                                        value={show.title}
                                        onChange={(e) => updateShow(show.id, 'title', e.target.value)}
                                        className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-xl font-bold text-cyan-400 focus:border-cyan-400 outline-none"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Type</label>
                                        <select 
                                            value={show.type} 
                                            onChange={e => updateShow(show.id, 'type', e.target.value)}
                                            className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                                        >
                                            <option value="Artist Show">Artist Show</option>
                                            <option value="Nebula Bash">Nebula Bash</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Theme (Optional)</label>
                                        <input 
                                            type="text" 
                                            value={show.theme || ''} 
                                            onChange={e => updateShow(show.id, 'theme', e.target.value)} 
                                            className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                                            placeholder="None"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-[1.5]">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Date</label>
                                    <input type="text" value={show.date} onChange={e => updateShow(show.id, 'date', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Time</label>
                                    <input type="text" value={show.time} onChange={e => updateShow(show.id, 'time', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Venue</label>
                                    <input type="text" value={show.venue} onChange={e => updateShow(show.id, 'venue', e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Tickets Left</label>
                                    <input type="number" value={show.ticketsLeft} onChange={e => updateShow(show.id, 'ticketsLeft', parseInt(e.target.value)||0)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Price ($)</label>
                                    <input type="number" value={show.price} onChange={e => updateShow(show.id, 'price', parseFloat(e.target.value)||0)} className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer group/sold">
                                        <input 
                                            type="checkbox" 
                                            checked={show.soldOut} 
                                            onChange={e => updateShow(show.id, 'soldOut', e.target.checked)}
                                            className="w-4 h-4 rounded border-white/10 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                                        />
                                        <span className="text-[10px] uppercase tracking-widest text-slate-400 group-hover/sold:text-white transition-colors">Sold Out</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Description</label>
                            <textarea 
                                value={show.description || ''} 
                                onChange={e => updateShow(show.id, 'description', e.target.value)} 
                                className="w-full bg-slate-800 border border-white/5 rounded px-3 py-2 text-sm text-slate-300 outline-none focus:border-cyan-400 h-20 resize-none"
                                placeholder="Add event description..."
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
