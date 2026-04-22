'use client';

import { useState } from 'react';
import { updateKnowledgeAction } from '@/app/actions/knowledge';
import { Loader2, Save, Terminal } from 'lucide-react';
import { TechBorder } from '@/components/ui/TechBorder';

interface Props {
    initialContent: string;
}

export function KnowledgeManager({ initialContent }: Props) {
    const [content, setContent] = useState(initialContent);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setIsLoading(true);
        setMessage('');
        const res = await updateKnowledgeAction(content);
        setMessage(res.success ? 'Neural Link Updated' : (res.error || 'Sync Failed'));
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <TechBorder color="cyan" intensity="high" cornerSize={24} className="w-full">
            <div className="bg-black/90 p-6 md:p-8 flex flex-col font-mono min-h-[600px] relative">
                
                <header className="mb-6 flex items-center justify-between border-b border-cyan-500/20 pb-4">
                    <div className="flex items-center gap-4">
                        <Terminal className="text-cyan-400" size={24} />
                        <div>
                            <h2 className="text-2xl pt-2 font-bold font-display tracking-widest text-white uppercase glow-text">
                                LUNA Knowledge Base
                            </h2>
                            <div className="text-[10px] tracking-[0.3em] text-cyan-500 mt-1 uppercase">
                                System Master Document (Markdown)
                            </div>
                        </div>
                    </div>
                </header>
                
                <div className="flex-1 flex flex-col gap-4">
                    <textarea 
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="w-full flex-1 bg-black/50 border border-cyan-500/30 rounded p-6 text-slate-300 font-mono text-sm leading-relaxed focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)] outline-none transition-all resize-none min-h-[500px]"
                        spellCheck="false"
                    />

                    <div className="flex items-center justify-between mt-4">
                        <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">{message}</span>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-3 px-8 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 hover:border-cyan-400 rounded text-cyan-400 font-bold transition-all disabled:opacity-50 uppercase tracking-widest"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Synchronize Lore
                        </button>
                    </div>
                </div>
            </div>
        </TechBorder>
    );
}
