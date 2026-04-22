import { Mail, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface WaitlistEntry {
    email: string;
    signedUpAt: string;
}

async function getWaitlist(): Promise<WaitlistEntry[]> {
    try {
        const { readFile } = await import('fs/promises');
        const path = await import('path');
        const data = await readFile(path.join(process.cwd(), 'src/data/waitlist.json'), 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export default async function AdminWaitlistPage() {
    const entries = await getWaitlist();

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-cyan-400 font-display">Mailing List</h1>
                <div className="flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 rounded-xl px-4 py-2">
                    <Users size={16} className="text-cyan-400" />
                    <span className="text-cyan-400 font-mono font-bold text-sm">{entries.length} SUBSCRIBERS</span>
                </div>
            </div>

            {entries.length === 0 ? (
                <div className="bg-slate-900 border border-white/10 rounded-xl p-12 text-center">
                    <Mail size={40} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-mono text-sm">No subscribers yet. Share the launching soon page to start collecting emails.</p>
                    <a
                        href="/launching-soon"
                        target="_blank"
                        className="inline-block mt-4 text-cyan-400 font-mono text-xs underline underline-offset-4"
                    >
                        View /launching-soon →
                    </a>
                </div>
            ) : (
                <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-3 border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-mono">
                        <span>Email</span>
                        <span>Signed Up</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {entries.map((entry, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4 hover:bg-white/2 transition-colors items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                                        <Mail size={12} className="text-cyan-400" />
                                    </div>
                                    <span className="text-white font-mono text-sm">{entry.email}</span>
                                </div>
                                <span className="text-slate-500 font-mono text-xs whitespace-nowrap">
                                    {new Date(entry.signedUpAt).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 p-4 bg-slate-900/50 border border-white/5 rounded-xl">
                <p className="text-slate-500 font-mono text-xs">
                    <span className="text-slate-400">Landing page:</span>{' '}
                    <a href="/launching-soon" target="_blank" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
                        {process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000'}/launching-soon
                    </a>
                </p>
            </div>
        </div>
    );
}
