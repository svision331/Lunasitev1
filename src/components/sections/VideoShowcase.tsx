'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Music } from 'lucide-react';
import Image from 'next/image';
import { useSwipe } from '@/hooks';
import { videoCategories, type VideoCategory, type Video } from '@/data/videos';
import { VideoModal } from '@/components/ui';
import { useSoundEffects } from '@/hooks/useSoundEffects'; // Import Sound Hook

interface VideoShowcaseProps {
    videos: Video[];
}

export function VideoShowcase({ videos }: VideoShowcaseProps) {
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videoFilter, setVideoFilter] = useState<VideoCategory>('All');
    const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
    const [isScanning, setIsScanning] = useState(false); // New Scanning State
    const [isExpanded, setIsExpanded] = useState(false);

    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { playHover, playClick, playSuccess, playTyping } = useSoundEffects(); // Use Sound Hook

    const [dataStream, setDataStream] = useState<{ text: string; opacity: number; delay: number }[]>([]);

    // Parallax background hooks
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    });
    const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
    const gridY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    // Generate random data stream only on client to avoid hydration mismatch
    useEffect(() => {
        const stream = Array.from({ length: 20 }).map((_, i) => ({
            text: Array.from({ length: 15 }).map(() => Math.random().toString(16).substring(2, 8).toUpperCase()).join(' '),
            opacity: Math.random(),
            delay: i * -1
        }));
        setTimeout(() => setDataStream(stream), 0);
    }, []);

    const filteredVideos = videoFilter === 'All'
        ? videos
        : videos.filter((v) => v.category === videoFilter);

    // Auto-play carousel
    useEffect(() => {
        if (!autoPlayEnabled || filteredVideos.length <= 1) return;

        autoPlayTimerRef.current = setInterval(() => {
            setCurrentVideoIndex((prev) => (prev + 1) % filteredVideos.length);
        }, 5000);

        return () => {
            if (autoPlayTimerRef.current) {
                clearInterval(autoPlayTimerRef.current);
            }
        };
    }, [autoPlayEnabled, filteredVideos.length]);

    const stopAutoPlay = useCallback(() => {
        setAutoPlayEnabled(false);
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
        }
    }, []);

    // Enhanced Navigation with Scan Effect
    const changeVideoWithScan = useCallback((newIndex: number) => {
        setIsScanning(true);
        playTyping(); // Play sound on scan start

        setTimeout(() => {
            setCurrentVideoIndex(newIndex);
            // Short delay before revealing the image completely
            setTimeout(() => {
                setIsScanning(false);
                playSuccess(); // Play success tone when signal acquired
            }, 600);
        }, 300);
    }, [playTyping, playSuccess]);

    const nextVideo = useCallback(() => {
        stopAutoPlay();
        changeVideoWithScan((currentVideoIndex + 1) % filteredVideos.length);
    }, [stopAutoPlay, currentVideoIndex, filteredVideos.length, changeVideoWithScan]);

    const prevVideo = useCallback(() => {
        stopAutoPlay();
        changeVideoWithScan((currentVideoIndex - 1 + filteredVideos.length) % filteredVideos.length);
    }, [stopAutoPlay, currentVideoIndex, filteredVideos.length, changeVideoWithScan]);

    const goToVideo = (index: number) => {
        stopAutoPlay();
        changeVideoWithScan(index);
    };

    // Touch gesture support
    const swipeHandlers = useSwipe({
        onSwipeLeft: nextVideo,
        onSwipeRight: prevVideo,
    });

    const currentVideo = filteredVideos[currentVideoIndex];


    return (
        <section
            ref={containerRef}
            id="watch"
            className="section relative overflow-hidden min-h-screen flex flex-col justify-center"
            {...swipeHandlers}
        >
            {/* Background Layers */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Space & Atmosphere */}
                <motion.div 
                    style={{ y: bgY }}
                    className="absolute inset-[-20%] bg-[url('/images/hero-bg-v2.jpg')] bg-cover bg-center opacity-20 blur-3xl mix-blend-color-dodge" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/90 to-transparent" />

                {/* Tech Grid & Scanlines */}
                <motion.div 
                    style={{ y: gridY }}
                    className="absolute inset-[-10%] bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-50" 
                />
                <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-[0.05]" />

                {/* Ambient Video Blowout */}
                {currentVideo && (
                    <div className="absolute inset-0 opacity-30 transition-opacity duration-1000 mix-blend-screen">
                        <Image
                            src={currentVideo.thumb}
                            alt="Ambient bg"
                            fill
                            className={`object-cover blur-[100px] scale-150 animate-pulse-slow ${isScanning ? 'brightness-150 grayscale' : 'grayscale-0'}`}
                        />
                    </div>
                )}
            </div>

            {/* Scrolling Hex Data Background (Subtle) */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none font-mono text-[10px] leading-tight text-cyan-500 hidden xl:block select-none">
                {dataStream.map((line, i) => (
                    <div key={i} className="whitespace-nowrap animate-[scrollLeft_20s_linear_infinite]" style={{ animationDelay: `${line.delay}s`, opacity: line.opacity }}>
                        {line.text}
                    </div>
                ))}
            </div>

            <div className="max-w-[1500px] mx-auto w-full relative z-10 px-4 md:px-8">
                {/* Header Section */}
                {/* Header Section */}
                <motion.div
                    className="mb-12 text-center relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-block relative group cursor-default" onMouseEnter={playHover}>
                        <h2 className="text-4xl sm:text-6xl md:text-9xl font-bold font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 via-white to-cyan-900 mb-4 relative z-10 glitch-text drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]" data-text="LUNAVERSE">
                            LUNAVERSE
                        </h2>
                        {/* Decorative Lines */}
                        <div className="absolute -left-4 md:-left-20 top-1/2 w-8 md:w-16 h-[2px] bg-gradient-to-r from-transparent to-cyan-500 hidden md:block group-hover:w-24 transition-all duration-500" />
                        <div className="absolute -right-4 md:-right-20 top-1/2 w-8 md:w-16 h-[2px] bg-gradient-to-l from-transparent to-cyan-500 hidden md:block group-hover:w-24 transition-all duration-500" />
                    </div>

                    {/* Category Filter */}
                    <div className="flex justify-center mt-8 perspective-[1000px]">
                        <div className="inline-flex items-center gap-2 p-2 bg-black/40 border border-white/10 backdrop-blur-xl rounded-full shadow-2xl transform-style-3d hover:rotate-x-12 transition-transform duration-500">
                            {videoCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onMouseEnter={playHover}
                                    onClick={() => {
                                        if (videoFilter !== cat) playClick();
                                        setVideoFilter(cat);
                                        changeVideoWithScan(0);
                                        setAutoPlayEnabled(true);
                                    }}
                                    className={`
                                        relative px-6 py-2 text-xs md:text-sm font-mono uppercase tracking-widest transition-all duration-300 rounded-full flex items-center gap-2
                                        ${videoFilter === cat
                                            ? 'text-black bg-cyan-400 font-bold shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-105'
                                            : 'text-cyan-400 hover:text-white hover:bg-white/10'}
                                    `}
                                >
                                    {videoFilter === cat && <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />}
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col xl:flex-row gap-8 xl:h-[650px]">

                    {/* Main Stage */}
                    <motion.div
                        className="flex-[2] flex flex-col gap-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {/* Video Player Container */}
                        <div
                            className="relative aspect-video group"
                            style={{ filter: 'drop-shadow(0 0 30px rgba(34,211,238,0.2))' }}
                            onMouseEnter={playHover}
                        >
                            {/* Detailed Tech Frame */}
                            <div className="absolute inset-0 z-40 pointer-events-none">
                                {/* Corners */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400 opacity-60" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-400 opacity-60" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-400 opacity-60" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-400 opacity-60" />

                                {/* Side Decorations */}
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[1px] h-16 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50" />
                                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[1px] h-16 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50" />
                            </div>

                            {/* Content Area */}
                            <div
                                className="relative w-full h-full overflow-hidden bg-black/80 backdrop-blur-sm border border-white/5"
                            >
                                <div
                                    className="relative w-full h-full cursor-pointer"
                                    onClick={() => {
                                        playClick();
                                        stopAutoPlay();
                                        if (currentVideo) setActiveVideo(currentVideo);
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10 opacity-30 transition-opacity duration-500" />

                                    {/* Video Thumbnail / Scanning State */}
                                    {isScanning ? (
                                        <div className="absolute inset-0 bg-black z-30 flex flex-col items-center justify-center font-mono text-cyan-500">
                                            <div className="text-4xl font-bold animate-pulse mb-2">SCANNING...</div>
                                            <div className="text-xs tracking-[0.5em] opacity-70">SIGNAL ACQUISITION IN PROGRESS</div>
                                            <div className="mt-8 flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-2 h-8 bg-cyan-500 animate-[pulse_0.5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.1}s` }} />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        currentVideo ? (
                                            <Image
                                                src={currentVideo.thumb}
                                                alt={currentVideo.title}
                                                fill
                                                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-black flex items-center justify-center text-cyan-500 font-mono">
                                                NO SIGNAL
                                            </div>
                                        )
                                    )}

                                    {/* Play Button */}
                                    {!isScanning && currentVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center z-30">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center relative"
                                            >
                                                <div className="absolute inset-0 border border-cyan-400/50 rounded-full animate-[spin_4s_linear_infinite]" />
                                                <div className="absolute inset-2 border border-cyan-400/30 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                                                <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-md rounded-full" />
                                                <Play size={32} className="text-cyan-100 fill-cyan-100 translate-x-1 relative z-10 w-6 h-6 md:w-8 md:h-8" />
                                            </motion.div>
                                        </div>
                                    )}

                                    {/* HUD Info */}
                                    {currentVideo && (
                                        <div className="absolute top-6 left-6 md:left-12 z-30 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-70">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 bg-red-500 animate-pulse" />
                                                <span className="text-[10px] font-mono text-red-500 tracking-[0.2em] font-bold">REC</span>
                                            </div>
                                            <div className="text-[10px] font-mono text-cyan-500/60 typing-cursor">CAM_04 // SIGNAL_MAX</div>
                                        </div>
                                    )}

                                    {/* Meta Data */}
                                    {currentVideo && (
                                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pl-6 md:pl-12 z-20 bg-gradient-to-t from-black via-black/90 to-transparent">
                                            <h3 className="text-xl md:text-3xl lg:text-5xl font-bold text-white font-display mb-2 md:mb-3 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] uppercase">
                                                {currentVideo.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-cyan-400 font-mono text-[10px] md:text-xs tracking-wider uppercase">
                                                <span className="px-2 py-0.5 md:px-3 md:py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-sm hover:bg-cyan-900/50 transition-colors">
                                                    {currentVideo.category}
                                                </span>
                                                <span className="opacity-60">|</span>
                                                <span>{currentVideo.duration}</span>


                                            </div>
                                            {currentVideo.description && (
                                                <p className="text-xs md:text-sm text-cyan-200/80 max-w-2xl mt-2 line-clamp-1 md:line-clamp-2 font-sans hidden sm:block">
                                                    {currentVideo.description}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Audio Strip */}
                        <motion.div
                            className="h-16 md:h-20 lg:h-24 relative group overflow-hidden cursor-pointer"
                            style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                            whileHover={{ scale: 1.005 }}
                            onMouseEnter={playHover}
                            onClick={playClick}
                        >
                            <div className="absolute inset-0 bg-cyan-950/20 backdrop-blur-md border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors" />
                            <div className="absolute left-0 top-0 w-2 h-full bg-cyan-500/50 group-hover:shadow-[0_0_15px_cyan] transition-shadow" />

                            <div className="absolute inset-0 flex items-center px-4 md:px-8 gap-4 md:gap-6 z-10">
                                <div className="p-2 md:p-3 bg-cyan-500/10 border border-cyan-500/30 shrink-0 animate-pulse-slow ml-1 md:ml-2">
                                    <Music className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="h-[1px] w-4 bg-cyan-500/50" />
                                        <span className="text-[9px] text-cyan-400 font-mono tracking-[0.3em] uppercase hidden sm:inline">Audio_Link_Active</span>
                                    </div>
                                    <div className="text-sm md:text-lg font-bold text-white truncate font-display tracking-wide">ICE GIANT LOVER GIRL</div>
                                </div>
                                <div className="w-[120px] md:w-[250px] h-10 md:h-12 relative opacity-60 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                                    <iframe
                                        src="https://open.spotify.com/embed/track/1MQglbc4WElorNiIwULAxX?utm_source=generator&theme=0&autoplay=1"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                        title="Spotify Audio Player: Ice Giant Lover Girl"
                                        className="h-full w-full opacity-80"
                                        style={{ maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)' }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Playlist Stream */}
                    <div className="xl:w-[450px] flex flex-col h-full relative" onMouseEnter={playHover}>
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden" />

                        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10 bg-white/5">
                            <div>
                                <h4 className="text-sm font-mono text-cyan-400 tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                    Playlist_Data
                                </h4>
                                <div className="text-[9px] text-zinc-500 font-mono">SECURE CONNECTION ESTABLISHED</div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { playClick(); prevVideo(); }}
                                    onMouseEnter={playHover}
                                    className="p-2 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 text-cyan-400 transition-all rounded"
                                    aria-label="Previous video"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => { playClick(); nextVideo(); }}
                                    onMouseEnter={playHover}
                                    className="p-2 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 text-cyan-400 transition-all rounded"
                                    aria-label="Next video"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar relative z-10">
                            {filteredVideos.slice(0, isExpanded ? undefined : 4).map((video, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => { playClick(); goToVideo(idx); }}
                                    onMouseEnter={playHover}
                                    className={`
                                        group flex gap-4 p-3 cursor-pointer transition-all duration-300 rounded-lg border
                                        ${idx === currentVideoIndex
                                            ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                                            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}
                                    `}
                                >
                                    <div className="relative w-32 aspect-video bg-black shrink-0 rounded overflow-hidden border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                                        <Image src={video.thumb} alt={video.title} fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                        {idx === currentVideoIndex && (
                                            <div className="absolute inset-0 bg-cyan-500/20 animate-pulse" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                                        <h4 className={`text-xs font-bold font-mono uppercase truncate ${idx === currentVideoIndex ? 'text-cyan-300' : 'text-zinc-400 group-hover:text-cyan-200'}`}>
                                            {video.title}
                                        </h4>
                                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-mono">
                                            <span className={`${idx === currentVideoIndex ? 'text-cyan-600' : 'text-zinc-600'}`}>{video.duration || '00:00'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Expansion Button */}
                            {filteredVideos.length > 4 && (
                                <button
                                    onClick={() => {
                                        playClick();
                                        setIsExpanded(!isExpanded);
                                    }}
                                    onMouseEnter={playHover}
                                    className="w-full py-3 mt-2 flex items-center justify-center gap-2 bg-black/40 border border-cyan-500/30 hover:bg-cyan-950/30 hover:border-cyan-400/60 rounded text-xs font-mono text-cyan-400 uppercase tracking-widest transition-all group"
                                >
                                    <span>{isExpanded ? 'Collapse_Log' : 'Expand_Database'}</span>
                                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronLeft className="-rotate-90" size={12} />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Video Modal */}
            {activeVideo && (
                <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
            )}
        </section>
    );
}
