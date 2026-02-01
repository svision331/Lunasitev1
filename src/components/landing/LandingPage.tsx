'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar, MobileNav, Footer } from '@/components/layout';
import { NebulaConsole } from '@/components/landing/NebulaConsole';
import { Hero } from '@/components/sections';
import { Starfield, IceGiantMode } from '@/components/effects';
import { Video } from '@/data/videos';

// Lazy load below-the-fold sections
const VideoShowcase = dynamic(() => import('@/components/sections').then(mod => mod.VideoShowcase));
const LiveShows = dynamic(() => import('@/components/sections').then(mod => mod.LiveShows));
const NebulaBash = dynamic(() => import('@/components/sections').then(mod => mod.NebulaBash));
const Membership = dynamic(() => import('@/components/sections').then(mod => mod.Membership));
const Lore = dynamic(() => import('@/components/sections').then(mod => mod.Lore));
const Community = dynamic(() => import('@/components/sections').then(mod => mod.Community));
const Press = dynamic(() => import('@/components/sections').then(mod => mod.Press));
const Gallery = dynamic(() => import('@/components/sections').then(mod => mod.Gallery));

interface LandingPageProps {
    videos: Video[];
}

export function LandingPage({ videos }: LandingPageProps) {
    const [hasEntered, setHasEntered] = useState(false);
    const [isWarping, setIsWarping] = useState(false);
    const [startSequence, setStartSequence] = useState(false);

    useEffect(() => {
        if (!startSequence) return;

        // Sequence timers
        const t1 = setTimeout(() => {
            setHasEntered(true);
        }, 1500);

        const t2 = setTimeout(() => {
            setIsWarping(false);
            setStartSequence(false); // Reset sequence trigger
        }, 3500); // 1500 + 2000

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [startSequence]);

    const handleEnter = () => {
        setStartSequence(true);
        setIsWarping(true);
    };

    return (
        <main className="min-h-screen relative">
            {/* Global Background Effects - Always Visible */}
            <Starfield warp={isWarping} />

            <div className={`transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <IceGiantMode />
            </div>

            {/* Entrance Console */}
            {!hasEntered && (
                <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ${isWarping ? 'opacity-0' : 'opacity-100'}`}>
                    <NebulaConsole onEnter={handleEnter} />
                </div>
            )}

            <div className={hasEntered ? 'opacity-100 transition-opacity duration-2000 delay-500' : 'opacity-0 h-0 overflow-hidden'}>
                {/* Navigation */}
                <Navbar />
                <MobileNav />

                {/* Sections */}
                <div className="relative z-10">
                    <Hero />
                    <VideoShowcase videos={videos} />
                    <LiveShows />
                    <NebulaBash />
                    <Lore />
                    <Gallery />
                    <Community />
                    <Membership />
                    <Press />
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </main>
    );
}
