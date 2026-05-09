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
            id = await saveVideoFile(file);
        } else {
            throw new Error('No video source provided (file or YouTube ID)');
        }

        let thumbnailUrl = videoUrl; // Fallback
        if (thumbnail) {
            thumbnailUrl = await saveVideoFile(thumbnail);
        }

        const newVideo: Video = {
            id,
            title,
            category: category === 'All' ? 'Live Shows' : category,
            thumb: thumbnailUrl,
            description,
            isLocal,
            duration,
            views
        };

        await saveVideo(newVideo);
        revalidatePath('/');
        return { success: true, video: newVideo };
    } catch (error: unknown) {
        console.error('Upload video error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function updateVideoAction(id: string, updates: Partial<Video>) {
    try {
        await updateVideo(id, updates);
        revalidatePath('/');
        return { success: true };
    } catch (error: unknown) {
        console.error('Update video error:', error);
        return { success: false, error: 'Failed to update video' };
    }
}

export async function deleteVideoAction(id: string) {
    try {
        await deleteVideo(id);
        revalidatePath('/');
        return { success: true };
    } catch (error: unknown) {
        console.error('Delete video error:', error);
        return { success: false, error: 'Failed to delete video' };
    }
}
