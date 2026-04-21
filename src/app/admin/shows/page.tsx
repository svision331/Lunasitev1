import { ShowManager } from '@/components/admin/ShowManager';
import { getShows } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function AdminShowsPage() {
    const shows = await getShows();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-cyan-400 font-display">Calendar Events</h1>
            <ShowManager initialShows={shows} />
        </div>
    );
}
