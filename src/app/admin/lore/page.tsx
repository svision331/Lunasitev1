import { LoreManager } from '@/components/admin/LoreManager';
import { getCosmos } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function AdminLorePage() {
    const cosmos = await getCosmos();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-cyan-400 font-display">Cosmic Lore (System Map)</h1>
            <LoreManager initialCosmos={cosmos} />
        </div>
    );
}
