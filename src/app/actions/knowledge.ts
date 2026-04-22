'use server';

import { saveKnowledge } from '@/lib/storage';
import { revalidatePath } from 'next/cache';

export async function updateKnowledgeAction(content: string) {
    try {
        await saveKnowledge(content);
        revalidatePath('/');
        revalidatePath('/admin/knowledge');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update Knowledge Base' };
    }
}
