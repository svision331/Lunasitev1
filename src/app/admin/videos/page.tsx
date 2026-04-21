import { VideoManager } from '@/components/admin/VideoManager';
import { getVideos } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function AdminVideosPage() {
    const videos = await getVideos();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-cyan-400 font-display">Video Management</h1>
            <VideoManager initialVideos={videos} />
        </div>
    );
}
