'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar, MobileNav, Footer } from '@/components/layout';
import { NebulaConsole } from '@/components/landing/NebulaConsole';
import { Hero } from '@/components/sections';
import { Starfield, IceGiantMode } from '@/components/effects';
import { useSoundEffects } from '@/hooks/useSoundEffects';

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

import { useSettings } from '@/context/SettingsContext';

// ... imports

export function LandingPage({ videos }: LandingPageProps) {
    const [hasEntered, setHasEntered] = useState(false);
    const [isWarping, setIsWarping] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [startSequence, setStartSequence] = useState(false);
    const { playWarp } = useSoundEffects();
    const { settings } = useSettings();

    useEffect(() => {
        if (!startSequence) return;

        // Trigger Sound
        playWarp();

        // 1. Wait 2s before starting to fade out the console
        const tFade = setTimeout(() => {
            setIsFading(true);
        }, 2000);

        // 2. Reveal the main site after fade completes (2s + 1s fade)
        const tEnter = setTimeout(() => {
            setHasEntered(true);
        }, 3000);

        // 3. Stop the warp effect after everything settles
        const tEndWarp = setTimeout(() => {
            setIsWarping(false);
            setStartSequence(false);
        }, 5000);

        return () => {
            clearTimeout(tFade);
            clearTimeout(tEnter);
            clearTimeout(tEndWarp);
        };
    }, [startSequence, playWarp]);

    const handleEnter = () => {
        setStartSequence(true);
        setIsWarping(true); // Start star warp immediately
    };

    const handleReturnToBridge = () => {
        setHasEntered(false);
        setStartSequence(false);
        setIsWarping(false);
        setIsFading(false);
    };

    return (
        <main className="min-h-screen relative">
            {/* Global Background Effects - Always Visible */}
            <Starfield warp={isWarping} reducedMotion={settings.reducedMotion} />

            <div className={`transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <IceGiantMode />
            </div>

            {/* Entrance Console */}
            {!hasEntered && (
                <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    <NebulaConsole onEnter={handleEnter} />
                </div>
            )}

            <div className={hasEntered ? 'opacity-100 transition-opacity duration-2000 delay-500' : 'opacity-0 h-0 overflow-hidden'}>
                {/* Navigation */}
                <Navbar onReturnToBridge={handleReturnToBridge} />
                <MobileNav />

                {/* Sections */}
                <div className="relative z-10">
                    <Hero />
                    <Lore />
                    <LiveShows />
                    <NebulaBash />
                    <VideoShowcase videos={videos} />
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
