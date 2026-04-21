'use server';

import { savePhotos } from '@/lib/storage';
import { Photo } from '@/data/gallery';
import { revalidatePath } from 'next/cache';

export async function updatePhotosAction(photos: Photo[]) {
    try {
        await savePhotos(photos);
        revalidatePath('/');
        revalidatePath('/gallery');
        revalidatePath('/admin/photos');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update photos' };
    }
}
