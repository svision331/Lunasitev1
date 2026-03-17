'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SpaceDebris, NebulaGradient } from '@/components/effects';
import { Footer } from '@/components/layout/Footer';
import { StarmapNav } from '@/components/ui/StarmapNav';

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
    const router = useRouter();

    const handleNavigate = () => {
        // Redirect to home with a possible hash or just back to the main console
        // For now, redirecting to home is the safest way to "get back to the bridge"
        router.push('/');
    };

    return (
        <main className="min-h-screen bg-[#050508] text-slate-300 flex flex-col relative overflow-hidden font-mono">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <NebulaGradient />
                <SpaceDebris />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="pt-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
                    <div className="h-32 md:h-48">
                        <StarmapNav onNavigate={handleNavigate} />
                    </div>
                </div>

                <div className="flex-grow pt-12 pb-24 px-4 md:px-8 max-w-4xl mx-auto w-full">
                    <header className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase mb-4 opacity-90 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                            {title}
                        </h1>
                        <p className="text-cyan-400/70 uppercase tracking-widest text-sm font-semibold">
                            Last Updated: {lastUpdated}
                        </p>
                    </header>

                    <article className="prose prose-invert prose-cyan max-w-none prose-headings:font-bold prose-headings:tracking-widest prose-headings:text-cyan-100 prose-headings:uppercase prose-p:leading-relaxed prose-p:text-slate-300 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300 hover:prose-a:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] prose-strong:text-cyan-50 prose-li:text-slate-300">
                        {children}
                    </article>
                </div>

                <Footer />
            </div>
        </main>
    );
}
