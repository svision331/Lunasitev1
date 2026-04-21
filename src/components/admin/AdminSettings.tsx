'use client';

import { useState } from 'react';
import { updateSettingsAction } from '@/app/actions/settings';
import { GlobalSettings } from '@/lib/storage';
import { Loader2, Save } from 'lucide-react';

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
            setMessage('Settings saved successfully!');
        } else {
            setMessage(res.error || 'Failed to save');
        }
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    }

    return (
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 text-cyan-400">Global Configuration</h2>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Site Title</label>
                    <input 
                        type="text" 
                        value={settings.siteTitle}
                        onChange={e => setSettings({...settings, siteTitle: e.target.value})}
                        className="w-full bg-slate-800 border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded border border-slate-800">
                    <div>
                        <div className="font-bold text-white">Maintenance Mode</div>
                        <div className="text-xs text-slate-400">Disable access to the main bridge for non-admins</div>
                    </div>
                    <button 
                        onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                        className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-cyan-500' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded border border-slate-800">
                    <div>
                        <div className="font-bold text-white">Registration Enabled</div>
                        <div className="text-xs text-slate-400">Allow new users to join the crew</div>
                    </div>
                    <button 
                        onClick={() => setSettings({...settings, registrationEnabled: !settings.registrationEnabled})}
                        className={`w-12 h-6 rounded-full transition-colors relative ${settings.registrationEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.registrationEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Maximum Crew Capacity (Users)</label>
                    <input 
                        type="number" 
                        value={settings.maxUsers}
                        onChange={e => setSettings({...settings, maxUsers: parseInt(e.target.value) || 1000})}
                        className="w-full bg-slate-800 border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                    />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-sm font-bold text-cyan-400">
                    {message}
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Configuration
                </button>
            </div>
        </div>
    );
}
