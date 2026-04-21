'use client';

import { useState } from 'react';
import { Photo } from '@/data/gallery';
import { updatePhotosAction } from '@/app/actions/gallery_admin';
import { Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { uploadPhotoAction } from '@/app/actions/gallery';

interface Props {
    initialPhotos: Photo[];
}

export function PhotoManager({ initialPhotos }: Props) {
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    const removePhoto = (id: string) => {
        if(confirm('Delete this photo?')) {
            setPhotos(photos.filter(p => p.id !== id));
        }
    };

    const updatePhoto = (id: string, field: keyof Photo, value: any) => {
        setPhotos(photos.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        const res = await updatePhotosAction(photos);
        setMessage(res.success ? 'Photos updated!' : (res.error || 'Failed to save'));
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await uploadPhotoAction(formData);
        if (res.success && res.photo) {
            setPhotos([res.photo, ...photos]);
            setMessage('Photo uploaded successfully!');
        } else {
            setMessage(res.error || 'Failed to upload photo');
        }
        setUploading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-white/10 p-4 rounded-xl">
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-cyan-400 font-bold transition-colors cursor-pointer">
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} 
                    Upload New Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
                <div className="flex items-center gap-4">
                    <span className="text-cyan-400 text-sm font-bold">{message}</span>
                    <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors disabled:opacity-50">
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Edits
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.map((photo) => (
                    <div key={photo.id} className="bg-slate-900 border border-white/10 rounded-xl p-4 flex gap-4">
                        <div className="w-1/3 aspect-square bg-slate-800 rounded relative overflow-hidden">
                            <img src={photo.url} alt={photo.caption} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                                <input type="text" value={photo.caption} onChange={(e) => updatePhoto(photo.id, 'caption', e.target.value)} className="w-full bg-slate-800 border-none text-sm text-cyan-400 p-1 rounded outline-none" placeholder="Caption" />
                                <input type="text" value={photo.user} onChange={(e) => updatePhoto(photo.id, 'user', e.target.value)} className="w-full bg-slate-800 border-none text-xs text-slate-400 p-1 rounded outline-none" placeholder="Username" />
                                <div className="flex gap-2">
                                    <select value={photo.aspectRatio || 'square'} onChange={e => updatePhoto(photo.id, 'aspectRatio', e.target.value)} className="bg-slate-800 text-xs p-1 rounded outline-none text-white">
                                        <option value="square">Square</option>
                                        <option value="portrait">Portrait</option>
                                        <option value="landscape">Landscape</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                                <button onClick={() => removePhoto(photo.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
