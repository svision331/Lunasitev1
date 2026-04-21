import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-mono">
            {/* Admin Header */}
            <header className="bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-sm font-bold tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors uppercase">
                        ← Exit to Main App
                    </Link>
                    <nav className="hidden sm:flex items-center gap-6">
                        <Link href="/admin/videos" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                            Videos
                        </Link>
                        <Link href="/admin/photos" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                            Photos
                        </Link>
                        <Link href="/admin/shows" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                            Calendar
                        </Link>
                        <Link href="/admin/missions" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                            Events
                        </Link>
                        <Link href="/admin/lore" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                            Cosmic Lore
                        </Link>
                        <Link href="/admin/settings" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                            Settings
                        </Link>
                    </nav>
                </div>
                <div className="text-[10px] tracking-widest uppercase text-slate-500 font-bold border border-slate-700 px-3 py-1 rounded">
                    Admin Session Active
                </div>
            </header>

            {/* Mobile Nav */}
            <div className="sm:hidden bg-slate-900/50 border-b border-white/5 px-4 py-3 flex gap-4 overflow-x-auto">
                <Link href="/admin/videos" className="text-xs text-slate-300 whitespace-nowrap uppercase tracking-widest">
                    Videos
                </Link>
                <Link href="/admin/photos" className="text-xs text-slate-300 whitespace-nowrap uppercase tracking-widest">
                    Photos
                </Link>
                <Link href="/admin/shows" className="text-xs text-slate-300 whitespace-nowrap uppercase tracking-widest">
                    Calendar
                </Link>
                <Link href="/admin/missions" className="text-xs text-slate-300 whitespace-nowrap uppercase tracking-widest">
                    Events
                </Link>
                <Link href="/admin/lore" className="text-xs text-slate-300 whitespace-nowrap uppercase tracking-widest">
                    Lore
                </Link>
                <Link href="/admin/settings" className="text-xs text-slate-300 whitespace-nowrap uppercase tracking-widest">
                    Settings
                </Link>
            </div>

            {/* Content Area */}
            <main className="flex-1 p-6 md:p-8">
                {children}
            </main>
        </div>
    );
}
