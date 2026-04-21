'use server';

import { saveMissions } from '@/lib/storage';
import { Mission } from '@/data/missions';
import { revalidatePath } from 'next/cache';

export async function updateMissionsAction(missions: Mission[]) {
    try {
        await saveMissions(missions);
        revalidatePath('/');
        revalidatePath('/admin/missions');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update missions' };
    }
}
