import { KnowledgeManager } from '@/components/admin/KnowledgeManager';
import { getKnowledge } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function AdminKnowledgePage() {
    const content = await getKnowledge();

    return (
        <div className="max-w-6xl mx-auto">
            <KnowledgeManager initialContent={content} />
        </div>
    );
}
