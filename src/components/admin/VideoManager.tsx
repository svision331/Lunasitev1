'use client';

import { useState } from 'react';
import { uploadVideoAction, updateVideoAction, deleteVideoAction } from '@/app/actions/video';
import { Video, videoCategories } from '@/data/videos';
import { Trash, Edit, Plus, X, Loader2, Check } from 'lucide-react';
import Image from 'next/image';

async function generateThumbnails(file: File): Promise<string[]> {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        const thumbnails: string[] = [];
        // Capture 4 frames at different intervals
        const intervals = [0.1, 0.35, 0.6, 0.85];
        let currentIntervalIndex = 0;

        video.onloadedmetadata = () => {
            video.currentTime = video.duration * intervals[0];
        };

        video.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                thumbnails.push(canvas.toDataURL('image/jpeg', 0.8));
            }

            currentIntervalIndex++;
            if (currentIntervalIndex < intervals.length) {
                video.currentTime = video.duration * intervals[currentIntervalIndex];
            } else {
                // Done
                URL.revokeObjectURL(video.src);
                resolve(thumbnails);
            }
        };

        video.onerror = () => {
            URL.revokeObjectURL(video.src);
            resolve([]);
        };
    });
}

interface VideoManagerProps {
    initialVideos: Video[];
}

export function VideoManager({ initialVideos }: VideoManagerProps) {
    const [videos] = useState<Video[]>(initialVideos);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<Video | null>(null);

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            await deleteVideoAction(id);
            window.location.reload();
        } catch {
            alert('Failed to delete video');
        }
    }

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <p className="text-slate-400">Manage your visual logs and transmissions.</p>
                <button
                    onClick={() => { setEditingVideo(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors"
                    aria-label="Add new video"
                >
                    <Plus size={18} /> Add New Video
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <div key={video.id} className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden group">
                        <div className="aspect-video relative">
                            <Image src={video.thumb} alt={video.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => { setEditingVideo(video); setIsModalOpen(true); }}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
                                    aria-label={`Edit ${video.title}`}
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/50 rounded-full text-red-500 hover:text-white transition-colors"
                                    aria-label={`Delete ${video.title}`}
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                            {video.category === 'Transmissions' && <div className="absolute top-2 left-2 bg-red-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white animate-pulse">Transmission</div>}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-white truncate" title={video.title}>{video.title}</h3>
                            <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                                <span className="uppercase tracking-wider border border-white/10 px-2 py-0.5 rounded">{video.category}</span>

                            </div>
                            {video.description && (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{video.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <VideoFormModal
                    video={editingVideo}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => { setIsModalOpen(false); window.location.reload(); /* Simple reload to fetch new data */ }}
                />
            )}
        </div>
    );
}

function VideoFormModal({ video, onClose, onSuccess }: { video: Video | null, onClose: () => void, onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setIsGenerating(true);
            try {
                const thumbs = await generateThumbnails(file);
                setGeneratedThumbnails(thumbs);
                if (thumbs.length > 0) setSelectedThumbnail(thumbs[1]); // Default to the second one (usually better than 1st)
            } catch (err) {
                console.error('Failed to generate thumbnails', err);
            } finally {
                setIsGenerating(false);
            }
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError('');

        const duration = formData.get('duration') as string || '0:00';
        const views = formData.get('views') as string || '0';

        try {
            if (video) {
                await updateVideoAction(video.id, {
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    category: formData.get('category') as Video['category'],
                    duration,
                    views
                });
            } else {
                const res = await uploadVideoAction(formData);
                if (!res.success) throw new Error(res.error);
            }
            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-cyan-500/20 p-6 rounded-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white" title="Close"><X /></button>
                <h2 className="text-xl font-bold mb-6 text-cyan-400">{video ? 'Edit Video' : 'Add New Video'}</h2>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Title</label>
                        <input name="title" defaultValue={video?.title} required className="w-full bg-slate-800 border-slate-700 rounded p-2 text-white placeholder-slate-600 focus:border-cyan-500 outline-none" placeholder="Video Title" />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Category</label>
                        <select
                            name="category"
                            defaultValue={video?.category || 'Live Shows'}
                            className="w-full bg-slate-800 border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
                            aria-label="Select Video Category"
                        >
                            {videoCategories.map(c => c !== 'All' && <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Description / Caption</label>
                        <textarea name="description" defaultValue={video?.description} rows={3} placeholder="Add a description or caption..." className="w-full bg-slate-800 border-slate-700 rounded p-2 text-white placeholder-slate-600 focus:border-cyan-500 outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Duration</label>
                            <input name="duration" defaultValue={video?.duration} placeholder="e.g. 4:20" className="w-full bg-slate-800 border-slate-700 rounded p-2 text-white placeholder-slate-600 focus:border-cyan-500 outline-none" />
                        </div>
                        <div>

                        </div>
                    </div>

                    {!video && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">YouTube ID</label>
                                    <input name="youtubeId" placeholder="e.g. dQw4w9WgXcQ" className="w-full bg-slate-800 border-slate-700 rounded p-2 text-white placeholder-slate-600 focus:border-cyan-500 outline-none" />
                                </div>
                                <div className="flex items-center justify-center pt-5 text-sm text-slate-500">OR</div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Upload Video File</label>
                                <input
                                    type="file"
                                    name="file"
                                    title="Upload Video File"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="w-full text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/50 file:text-cyan-400 hover:file:bg-cyan-900/80"
                                />
                                {isGenerating && <p className="text-xs text-cyan-400 mt-2 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Generating thumbnails...</p>}
                            </div>

                            {generatedThumbnails.length > 0 && (
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Select Thumbnail</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {generatedThumbnails.map((thumb, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setSelectedThumbnail(thumb)}
                                                className={`relative aspect-video rounded overflow-hidden border-2 transition-all ${selectedThumbnail === thumb ? 'border-cyan-400 ring-2 ring-cyan-500/50' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            >
                                                <Image src={thumb} alt={`Thumbnail option ${idx + 1}`} fill className="object-cover" unoptimized />
                                                {selectedThumbnail === thumb && (
                                                    <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                                                        <div className="bg-cyan-500 p-1 rounded-full"><Check size={12} className="text-white" /></div>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">Or upload a custom one below:</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Custom Thumbnail</label>
                                <input type="file" name="thumbnail" accept="image/*" title="Custom Thumbnail" className="w-full text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/50 file:text-cyan-400 hover:file:bg-cyan-900/80" />
                            </div>
                        </>
                    )}

                    <button
                        disabled={isLoading}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded mt-4 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {isLoading ? 'Processing...' : (video ? 'Save Changes' : 'Upload Video')}
                    </button>
                </form>
            </div>
        </div>
    )
}
