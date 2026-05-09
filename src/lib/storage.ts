import fs from 'fs/promises';
import path from 'path';
import { Redis } from '@upstash/redis';
import { put } from '@vercel/blob';

import { Photo } from '@/data/gallery';
import { Video } from '@/data/videos';
import { Mission } from '@/data/missions';
import { Show } from '@/data/shows';
import { StarSystem } from '@/data/cosmos';

const STORE_PATH = path.join(process.cwd(), 'src/data/gallery-store.json');
const VIDEO_STORE_PATH = path.join(process.cwd(), 'src/data/videos.json');
const SETTINGS_STORE_PATH = path.join(process.cwd(), 'src/data/settings.json');
const MISSIONS_STORE_PATH = path.join(process.cwd(), 'src/data/missions.json');
const SHOWS_STORE_PATH = path.join(process.cwd(), 'src/data/shows.json');
const COSMOS_STORE_PATH = path.join(process.cwd(), 'src/data/cosmos.json');
const KNOWLEDGE_STORE_PATH = path.join(process.cwd(), 'src/data/knowledge.md');
const WAITLIST_STORE_PATH = path.join(process.cwd(), 'src/data/waitlist.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/gallery');
const VIDEO_UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/videos');

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export interface GlobalSettings {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    siteTitle: string;
    maxUsers: number;
}

const defaultSettings: GlobalSettings = {
    maintenanceMode: false,
    registrationEnabled: true,
    siteTitle: "LUNA THE LOVEGOD",
    maxUsers: 1000
};

export async function getGlobalSettings(): Promise<GlobalSettings> {
    if (redis) {
        const data = await redis.get<GlobalSettings>('global_settings');
        if (data) return { ...defaultSettings, ...data };
    }
    try {
        const data = await fs.readFile(SETTINGS_STORE_PATH, 'utf-8');
        return { ...defaultSettings, ...JSON.parse(data) };
    } catch {
        return defaultSettings;
    }
}

export async function updateGlobalSettings(updates: Partial<GlobalSettings>): Promise<void> {
    const current = await getGlobalSettings();
    const newSettings = { ...current, ...updates };
    if (redis) {
        await redis.set('global_settings', newSettings);
    } else {
        await fs.writeFile(SETTINGS_STORE_PATH, JSON.stringify(newSettings, null, 2));
    }
}

// Missions
export async function getMissions(): Promise<Mission[]> {
    if (redis) {
        const data = await redis.get<Mission[]>('missions');
        if (data) return data;
    }
    try {
        const data = await fs.readFile(MISSIONS_STORE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function saveMissions(missions: Mission[]): Promise<void> {
    if (redis) {
        await redis.set('missions', missions);
    } else {
        await fs.writeFile(MISSIONS_STORE_PATH, JSON.stringify(missions, null, 2));
    }
}

// Shows
export async function getShows(): Promise<Show[]> {
    if (redis) {
        const data = await redis.get<Show[]>('shows');
        if (data) return data;
    }
    try {
        const data = await fs.readFile(SHOWS_STORE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function saveShows(shows: Show[]): Promise<void> {
    if (redis) {
        await redis.set('shows', shows);
    } else {
        await fs.writeFile(SHOWS_STORE_PATH, JSON.stringify(shows, null, 2));
    }
}

// Cosmos
export async function getCosmos(): Promise<StarSystem[]> {
    if (redis) {
        const data = await redis.get<StarSystem[]>('cosmos');
        if (data) return data;
    }
    try {
        const data = await fs.readFile(COSMOS_STORE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function saveCosmos(systems: StarSystem[]): Promise<void> {
    if (redis) {
        await redis.set('cosmos', systems);
    } else {
        await fs.writeFile(COSMOS_STORE_PATH, JSON.stringify(systems, null, 2));
    }
}

// Gallery Photos
export async function getPhotos(): Promise<Photo[]> {
    if (redis) {
        const data = await redis.get<Photo[]>('photos');
        if (data) return data;
    }
    try {
        const data = await fs.readFile(STORE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading gallery store:', error);
        return [];
    }
}

export async function savePhoto(photo: Photo): Promise<void> {
    const photos = await getPhotos();
    photos.unshift(photo);
    if (redis) {
        await redis.set('photos', photos);
    } else {
        await fs.writeFile(STORE_PATH, JSON.stringify(photos, null, 2));
    }
}

export async function savePhotos(photos: Photo[]): Promise<void> {
    if (redis) {
        await redis.set('photos', photos);
    } else {
        await fs.writeFile(STORE_PATH, JSON.stringify(photos, null, 2));
    }
}

// Videos
export async function getVideos(): Promise<Video[]> {
    if (redis) {
        const data = await redis.get<Video[]>('videos');
        if (data) return data;
    }
    try {
        const data = await fs.readFile(VIDEO_STORE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading video store:', error);
        return [];
    }
}

export async function saveVideo(video: Video): Promise<void> {
    const videos = await getVideos();
    videos.unshift(video);
    if (redis) {
        await redis.set('videos', videos);
    } else {
        await fs.writeFile(VIDEO_STORE_PATH, JSON.stringify(videos, null, 2));
    }
}

export async function updateVideo(videoId: string, updates: Partial<Video>): Promise<void> {
    const videos = await getVideos();
    const index = videos.findIndex(v => v.id === videoId);
    if (index !== -1) {
        videos[index] = { ...videos[index], ...updates };
        if (redis) {
            await redis.set('videos', videos);
        } else {
            await fs.writeFile(VIDEO_STORE_PATH, JSON.stringify(videos, null, 2));
        }
    }
}

export async function deleteVideo(videoId: string): Promise<void> {
    const videos = await getVideos();
    const filteredVideos = videos.filter(v => v.id !== videoId);
    if (redis) {
        await redis.set('videos', filteredVideos);
    } else {
        await fs.writeFile(VIDEO_STORE_PATH, JSON.stringify(filteredVideos, null, 2));
    }
}

// Knowledge Base
export async function getKnowledge(): Promise<string> {
    if (redis) {
        const data = await redis.get<string>('knowledge');
        if (data !== null) return data;
    }
    try {
        return await fs.readFile(KNOWLEDGE_STORE_PATH, 'utf-8');
    } catch {
        return '';
    }
}

export async function saveKnowledge(content: string): Promise<void> {
    if (redis) {
        await redis.set('knowledge', content);
    } else {
        await fs.writeFile(KNOWLEDGE_STORE_PATH, content);
    }
}

// Waitlist
export interface WaitlistEntry {
    email: string;
    instagram: string;
    signedUpAt: string;
}

export async function getWaitlist(): Promise<WaitlistEntry[]> {
    if (redis) {
        const data = await redis.get<WaitlistEntry[]>('waitlist');
        if (data) return data;
    }
    try {
        const data = await fs.readFile(WAITLIST_STORE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function saveWaitlist(entries: WaitlistEntry[]): Promise<void> {
    if (redis) {
        await redis.set('waitlist', entries);
    } else {
        await fs.writeFile(WAITLIST_STORE_PATH, JSON.stringify(entries, null, 2));
    }
}

// File Uploads
export async function saveFile(file: File): Promise<string> {
    if (useBlob) {
        const blob = await put(`gallery/${Date.now()}-${file.name.replace(/\s+/g, '-')}`, file, { access: 'public' });
        return blob.url;
    } else {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(UPLOAD_DIR, fileName);
        try {
            await fs.access(UPLOAD_DIR);
        } catch {
            await fs.mkdir(UPLOAD_DIR, { recursive: true });
        }
        await fs.writeFile(filePath, buffer);
        return `/uploads/gallery/${fileName}`;
    }
}

export async function saveVideoFile(file: File): Promise<string> {
    if (useBlob) {
        const blob = await put(`videos/${Date.now()}-${file.name.replace(/\s+/g, '-')}`, file, { access: 'public' });
        return blob.url;
    } else {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(VIDEO_UPLOAD_DIR, fileName);
        try {
            await fs.access(VIDEO_UPLOAD_DIR);
        } catch {
            await fs.mkdir(VIDEO_UPLOAD_DIR, { recursive: true });
        }
        await fs.writeFile(filePath, buffer);
        return `/uploads/videos/${fileName}`;
    }
}
