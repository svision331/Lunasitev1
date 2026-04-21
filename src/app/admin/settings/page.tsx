import { AdminSettings } from '@/components/admin/AdminSettings';
import { getGlobalSettings } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const settings = await getGlobalSettings();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-cyan-400 font-display">System Settings</h1>
            
            <div className="max-w-2xl">
                <p className="text-slate-400 mb-6">Manage global parameters and core bridge overrides.</p>
                <AdminSettings initialSettings={settings} />
            </div>
        </div>
    );
}
