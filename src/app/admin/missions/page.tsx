import { MissionManager } from '@/components/admin/MissionManager';
import { getMissions } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function AdminMissionsPage() {
    const missions = await getMissions();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-cyan-400 font-display">Special Events (Missions)</h1>
            <MissionManager initialMissions={missions} />
        </div>
    );
}
