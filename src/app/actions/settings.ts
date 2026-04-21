'use server';

import { updateGlobalSettings, GlobalSettings } from '@/lib/storage';
import { revalidatePath } from 'next/cache';

export async function updateSettingsAction(updates: Partial<GlobalSettings>) {
    try {
        await updateGlobalSettings(updates);
        revalidatePath('/');
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error('Update settings error:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
