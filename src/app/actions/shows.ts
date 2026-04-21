'use server';

import { saveShows } from '@/lib/storage';
import { Show } from '@/data/shows';
import { revalidatePath } from 'next/cache';

export async function updateShowsAction(shows: Show[]) {
    try {
        await saveShows(shows);
        revalidatePath('/');
        revalidatePath('/admin/shows');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update shows' };
    }
}
