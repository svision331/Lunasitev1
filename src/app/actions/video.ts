'use server';

import { saveVideo, saveVideoFile, updateVideo, deleteVideo } from '@/lib/storage';
import { Video, VideoCategory } from '@/data/videos';
import { revalidatePath } from 'next/cache';

export async function uploadVideoAction(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        const thumbnail = formData.get('thumbnail') as File;
        const title = formData.get('title') as string;
        const category = formData.get('category') as VideoCategory;
        const description = formData.get('description') as string;
        const youtubeId = formData.get('youtubeId') as string;
        const duration = formData.get('duration') as string || '0:00';
        const views = formData.get('views') as string || '0';

        if (!title || !category) {
            throw new Error('Missing required fields');
        }

        let videoUrl = '';
        let isLocal = false;
        let id = '';

        if (youtubeId) {
            id = youtubeId;
            videoUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`; // Default thumb if none provided
        } else if (file) {
            isLocal = true;
            id = await saveVideoFile(file); // Stores local path as ID or separate field. Let's use ID for path if local.
            // Actually, if it's local, 'id' usually acts as the source or we need a 'src' field. 
            // In our current Video interface, 'id' is used for YouTube. 
            // If isLocal is true, we should probably treat 'id' as the file path or add a 'src' field.
            // For now, let's assume 'id' holds the path if isLocal is true.
        } else {
            throw new Error('No video source provided (file or YouTube ID)');
        }

        let thumbnailUrl = videoUrl; // Fallback
        if (thumbnail) {
            // Re-use saveVideoFile for thumbnail for now, or create a generic saveFile in storage if publicly exposed
            // storage.ts has saveFile for gallery, let's use that one or import specific logic.
            // The existing saveFile puts it in /gallery. Let's assume we can use that for now or add a generic one.
            // To incorporate reusing `saveFile` from `storage.ts` we need to import it.
            // But wait, `saveFile` in `storage.ts` saves to `public/uploads/gallery`. 
            // We might want a generic upload, but for now using that is fine or I can just use saveVideoFile which goes to `videos`.
            // Let's us saveVideoFile for video assets for now.
            thumbnailUrl = await saveVideoFile(thumbnail);
        }

        const newVideo: Video = {
            id,
            title,
            category: category as any,
            thumb: thumbnailUrl,
            description,
            isLocal,
            duration,
            views
        };

        await saveVideo(newVideo);
        revalidatePath('/');
        return { success: true, video: newVideo };
    } catch (error) {
        console.error('Upload video error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateVideoAction(id: string, updates: Partial<Video>) {
    try {
        await updateVideo(id, updates);
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Update video error:', error);
        return { success: false, error: 'Failed to update video' };
    }
}

export async function deleteVideoAction(id: string) {
    try {
        await deleteVideo(id);
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Delete video error:', error);
        return { success: false, error: 'Failed to delete video' };
    }
}
