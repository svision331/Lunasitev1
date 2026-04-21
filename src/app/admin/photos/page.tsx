import { PhotoManager } from '@/components/admin/PhotoManager';
import { getPhotos } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function AdminPhotosPage() {
    const photos = await getPhotos();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-cyan-400 font-display">Photo Gallery</h1>
            <PhotoManager initialPhotos={photos} />
        </div>
    );
}
