'use server';

import { getMissions, getShows, getCosmos } from '@/lib/storage';

export async function fetchMissions() {
    return getMissions();
}

export async function fetchShows() {
    return getShows();
}

export async function fetchCosmos() {
    return getCosmos();
}
