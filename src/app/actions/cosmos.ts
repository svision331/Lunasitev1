'use server';

import { saveCosmos } from '@/lib/storage';
import { StarSystem } from '@/data/cosmos';
import { revalidatePath } from 'next/cache';

export async function updateCosmosAction(cosmos: StarSystem[]) {
    try {
        await saveCosmos(cosmos);
        revalidatePath('/');
        revalidatePath('/admin/lore');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update cosmic lore' };
    }
}
