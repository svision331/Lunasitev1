'use client';

import React, { useEffect, useRef, useState } from "react";
import { Zap, Radio, Calendar, MapPin, Music, Activity, Globe, Volume2, VolumeX, Eye, EyeOff } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { SystemBar } from "@/components/bridge/SystemBar";

import { StatCard } from "@/components/bridge/StatCard";
import { MusicPlayer } from "@/components/bridge/MusicPlayer";
import { CommsInterface } from "@/components/bridge/CommsInterface";
import { MissionLog } from "@/components/bridge/MissionLog";
import { CosmosMap } from "@/components/bridge/CosmosMap";
import { TechBorder } from "@/components/ui/TechBorder";
import { GridBackground } from "@/components/effects/GridBackground";
import { Vortex } from "@/components/ui/vortex";
import { CyberButton } from "@/components/ui/CyberButton";
import { HoloCard } from "@/components/ui/HoloCard";
import { StarmapNav } from "@/components/ui/StarmapNav";

import { useSoundEffects } from "@/hooks/useSoundEffects";
import { ShipAmbience } from "@/components/effects/ShipAmbience";

type Log = { level: "INFO" | "WARN" | "OK" | "CRIT"; msg: string };
import { motion, AnimatePresence } from "framer-motion";

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

function formatTime(d: Date) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


interface NebulaConsoleProps {
    onEnter: () => void;
}

export function NebulaConsole({ onEnter }: NebulaConsoleProps) {
    const [mounted, setMounted] = useState(false);
    const { settings, toggleReducedMotion } = useSettings();

    const [activeModule, setActiveModule] = useState<'HOME' | 'MISSION' | 'MEDIA' | 'COMMS' | 'COSMOS'>('HOME');
    const [now, setNow] = useState<Date | null>(null);
    const [signal, setSignal] = useState(0);
    const [power, setPower] = useState(0);
    const [vibe, setVibe] = useState(0);
    const [sync, setSync] = useState(0);
    const [logs, setLogs] = useState<Log[]>([
        { level: "OK", msg: "Space Invaders network synchronized" },
        { level: "INFO", msg: "Next coordinates loading: FEB 14" },
        { level: "WARN", msg: "High demand detected - 27 tickets left" },
        { level: "OK", msg: "Ice Giant energy signature: MAXIMUM" },
    ]);
    const [isEntering, setIsEntering] = useState(false);

    const { playHover, playClick, playTyping, playSuccess, playError, toggleMute, isMuted } = useSoundEffects();

    const [cmd, setCmd] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const logContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setMounted(true);
            setNow(new Date());
            setSignal(randInt(84, 99));
            setPower(randInt(72, 96));
            setVibe(randInt(88, 98));
            setSync(randInt(65, 85));
        }, 0);

        const t = setInterval(() => {
            setNow(new Date());
            setSignal((v) => Math.max(70, Math.min(100, v + randInt(-1, 2))));
            setPower((v) => Math.max(60, Math.min(100, v + randInt(-1, 2))));
            setVibe((v) => Math.max(75, Math.min(100, v + randInt(-1, 2))));
            setSync((v) => Math.max(50, Math.min(100, v + randInt(-2, 3))));
        }, 2000);
        return () => clearInterval(t);
    }, []);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    function pushLog(level: Log["level"], msg: string) {
        setLogs((l) => [{ level, msg }, ...l].slice(0, 6)); // Keep only 6 logs, newest first
    }

    function handleEnter() {
        if (isEntering) return;
        playSuccess();
        setIsEntering(true);
        pushLog("OK", "Warp sequence initialized...");
        // Trigger parent immediately to start warp effect in background
        onEnter();
    }

    function onRun(e: React.FormEvent) {
        e.preventDefault();
        const q = cmd.trim().toLowerCase();
        if (!q) return;

        if (q === "help") {
            pushLog("INFO", "Commands: help, shows, bash, tickets, status, vibe, clear");
        } else if (q === "shows") {
            pushLog("OK", "Upcoming: Ice Giant Lover Girl Live - FEB 14, Bushwick");
        } else if (q === "bash") {
            pushLog("INFO", "Nebula Bash: Cosmic Valentine Ball - Secret Location");
        } else if (q === "tickets") {
            pushLog("WARN", "27 tickets remaining - High demand detected");
        } else if (q === "status") {
            pushLog("OK", `Network: ${signal}% | Power: ${power}% | Vibe: ${vibe}%`);
        } else if (q === "vibe") {
            pushLog("OK", "Portal energy at MAXIMUM - Ready for transmission");
        } else if (q === "clear") {
            setLogs([]);
            pushLog("OK", "Console cleared - Welcome back, Space Invader");
        } else {
            pushLog("WARN", `Unknown: "${q}" - Type "help" for commands`);
            playError();
            setCmd("");
            return;
        }

        playClick();
        setCmd("");
    }

    // SSR / Booting Fallback to prevent CLS
    if (!mounted) {
        return (
            <div className="fixed inset-0 z-50 overflow-hidden bg-black text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                    <div className="font-mono text-xs uppercase tracking-widest text-cyan-400">System Booting...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden text-white">
            {/* Cinematic Backdrop - Reduced opacity to see Starfield */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Conditional Rendering based on Reduced Motion */}
            {!settings.reducedMotion && (
                <>
                    <div className="absolute inset-0 cockpit-vignette" />
                    <div className="absolute inset-0 scanlines pointer-events-none" />
                    <div className="absolute inset-0 filmgrain pointer-events-none" />
                </>
            )}

            <ShipAmbience />


            <div className="relative h-full flex items-center justify-center p-2 md:p-4">
                {/* Main Console Frame */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="w-full max-w-6xl h-full md:h-auto max-h-full flex flex-col pointer-events-auto"
                >
                    <TechBorder className="w-full h-full" color="cyan" cornerSize={20}>
                        <div className="w-full h-full bg-black/80 backdrop-blur-md p-2 md:p-6 flex flex-col gap-4 md:gap-6">
                            <GridBackground opacity={0.1} />
                            <div className="cockpit-inner rounded-xl md:rounded-[22px] p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1 overflow-hidden min-h-0">

                                {/* Left Sidebar - Hidden on Mobile */}
                                <motion.aside
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="hidden md:flex col-span-12 md:col-span-3 flex-col gap-6"
                                >
                                    <TechBorder className="h-auto shrink-0" color="emerald" cornerSize={12}>
                                        <HoloCard variant="default" className="p-5 bg-black/60 relative overflow-hidden h-full">
                                            <GridBackground opacity={0.05} color="rgba(52, 211, 153, 1)" />
                                            <div className="relative z-10 space-y-4">
                                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 font-display hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">Sys_Mon</span>
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                                                </div>
                                                <SystemBar label="Network" value={signal} icon={Radio} />
                                                <SystemBar label="Power" value={power} icon={Zap} />
                                                <SystemBar label="Vibe" value={vibe} icon={Music} />
                                                <SystemBar label="Sync" value={sync} icon={Activity} />
                                            </div>
                                        </HoloCard>
                                    </TechBorder>

                                    <TechBorder className="flex-1 flex flex-col min-h-0" color="cyan" cornerSize={12}>
                                        <HoloCard variant="default" className="p-4 bg-black/60 h-full flex flex-col relative overflow-hidden">
                                            <div className="text-sm tracking-[0.2em] uppercase text-white/70 mb-3 font-display hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">Log_Stream</div>
                                            <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-4 font-mono text-xs md:text-sm pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 relative z-10">
                                                {logs.map((l, i) => (
                                                    <div key={i} className="flex gap-2 leading-tight opacity-80">
                                                        <span className={cx("shrink-0 font-bold",
                                                            l.level === "OK" ? "text-emerald-400" :
                                                                l.level === "WARN" ? "text-amber-400" :
                                                                    l.level === "CRIT" ? "text-red-400" : "text-cyan-400"
                                                        )}>{`[${l.level}]`}</span>
                                                        <span className={`text-white/70 ${i === 0 ? 'typing-cursor' : ''}`}>{l.msg}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </HoloCard>
                                    </TechBorder>
                                </motion.aside>

                                {/* Center Main Module - Full Width on Mobile */}
                                <main className="col-span-1 md:col-span-6 flex flex-col gap-4 md:gap-6 h-full min-h-0">
                                    {/* Header Panel */}
                                    <TechBorder color="cyan" cornerSize={12} className="shrink-0">
                                        <header className="p-4 md:p-6 bg-black/60 flex items-center justify-between relative overflow-hidden">
                                            <GridBackground opacity={0.1} />
                                            <div className="relative z-10">
                                                <div className="text-[10px] tracking-[0.3em] uppercase text-cyan-300 mb-1 font-display hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">Bridge Console</div>
                                                <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-gradient glitch-text" data-text="LUNATHELOVEGOD">
                                                    LUNATHELOVEGOD
                                                </h1>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 relative z-10">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-[10px] tracking-widest uppercase text-white/80 font-display hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">Local Time</div>
                                                    <div className="text-xl font-mono text-white mb-1">{now ? formatTime(now) : '00:00:00'}</div>
                                                </div>

                                                {/* Settings: Audio & Motion (Icon Mode) */}
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={toggleMute}
                                                        className={`p-2 rounded-full border transition-all duration-300 ${isMuted ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]'}`}
                                                        title={isMuted ? "Unmute Audio" : "Mute Audio"}
                                                        aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
                                                    >
                                                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                                    </button>
                                                    <button
                                                        onClick={toggleReducedMotion}
                                                        className={`p-2 rounded-full border transition-all duration-300 ${settings.reducedMotion ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' : 'bg-transparent text-white/20 border-white/10 hover:text-white/50 hover:bg-white/5'}`}
                                                        title={settings.reducedMotion ? "Enable Motion" : "Reduce Motion"}
                                                        aria-label={settings.reducedMotion ? "Enable Motion" : "Reduce Motion"}
                                                    >
                                                        {settings.reducedMotion ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </header>
                                    </TechBorder>

                                    {/* Visualizer / Hero Area */}
                                    <div className="flex-1 panel rounded-2xl p-1 relative overflow-hidden group flex items-center justify-center bg-black/40 min-h-0 border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                                        <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                                        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px]" />
                                        <AnimatePresence mode="wait">
                                            {activeModule === 'HOME' ? (
                                                <motion.div
                                                    key="HOME"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 1.05 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="w-full h-full relative"
                                                >
                                                    {/* Warp Speed Background - Pro Max Enhanced */}
                                                    <div className="absolute inset-0 star-warp opacity-50 mix-blend-screen" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 via-transparent to-purple-900/10 mix-blend-overlay" />

                                                    {/* Hero Image with Fade */}
                                                    <div
                                                        className="absolute inset-0 bg-[url('/images/console-hero-v2.png')] bg-cover bg-center opacity-70 mix-blend-lighten [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                                                    {/* Vortex Effect */}
                                                    <div className="absolute inset-0">
                                                        <Vortex
                                                            backgroundColor="transparent"
                                                            rangeY={800}
                                                            particleCount={150} // Heavy trim: 600 -> 150
                                                            baseHue={190} // Cyan/Blue range
                                                            rangeSpeed={0.8}
                                                            baseRadius={1}
                                                            rangeRadius={2}
                                                            containerClassName="w-full h-full"
                                                            className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                                                        >
                                                            <TechBorder className="w-full h-full" color="cyan" cornerSize={24} intensity="high">
                                                                <div className="relative z-10 text-center space-y-6 md:space-y-8 p-4">
                                                                    <HoloCard variant="active" className="inline-flex items-center gap-2 px-3 py-1 rounded-full cursor-default border-cyan-500/30">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_cyan]" />
                                                                        <span className="text-[10px] tracking-widest uppercase text-cyan-200 font-mono">System Ready</span>
                                                                    </HoloCard>

                                                                    <CyberButton
                                                                        variant="radioactive"
                                                                        onClick={handleEnter}
                                                                        onMouseEnter={playHover}
                                                                        disabled={isEntering}
                                                                        className={isEntering ? 'scale-110 brightness-150' : 'scale-125'}
                                                                    >
                                                                        {isEntering ? 'Engaging...' : 'Enter Portal'}
                                                                    </CyberButton>

                                                                    <div className="text-[10px] uppercase text-white/30 tracking-widest md:hidden animate-pulse font-mono">
                                                                        Tap to Initialize
                                                                    </div>
                                                                </div>
                                                            </TechBorder>
                                                        </Vortex>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key={activeModule}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-full h-full"
                                                >
                                                    {activeModule === 'MISSION' && <MissionLog onClose={() => setActiveModule('HOME')} />}
                                                    {activeModule === 'MEDIA' && <MusicPlayer onClose={() => setActiveModule('HOME')} />}
                                                    {activeModule === 'COMMS' && <CommsInterface onClose={() => setActiveModule('HOME')} />}
                                                    {activeModule === 'COSMOS' && <CosmosMap onClose={() => setActiveModule('HOME')} />}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Quick Actions Dock */}
                                    <TechBorder color="cyan" cornerSize={8} className="shrink-0">
                                        <div className="p-2 bg-black/60 flex items-center justify-between gap-2 overflow-x-auto">
                                            <div className="flex gap-2 w-full">
                                                <CyberButton
                                                    variant={activeModule === 'COSMOS' ? 'primary' : 'ghost'}
                                                    className="flex-1 text-[10px] md:text-xs py-3"
                                                    onClick={() => { setActiveModule('COSMOS'); playClick(); }}
                                                    onMouseEnter={playHover}
                                                >
                                                    <Globe size={14} className="mr-2" />
                                                    <span className="hidden md:inline font-display">COSMOS</span>
                                                </CyberButton>
                                                <CyberButton
                                                    variant={activeModule === 'MISSION' ? 'primary' : 'ghost'}
                                                    className="flex-1 text-[10px] md:text-xs py-3"
                                                    onClick={() => { setActiveModule('MISSION'); playClick(); }}
                                                    onMouseEnter={playHover}
                                                >
                                                    <Activity size={14} className="mr-2" />
                                                    <span className="hidden md:inline font-display">MISSION</span>
                                                </CyberButton>
                                                <CyberButton
                                                    variant={activeModule === 'MEDIA' ? 'primary' : 'ghost'}
                                                    className={`flex-1 text-[10px] md:text-xs py-3 ${activeModule === 'MEDIA' ? 'text-pink-400 border-pink-500/50' : 'text-pink-200/70 hover:text-pink-100'}`}
                                                    onClick={() => { setActiveModule('MEDIA'); playClick(); }}
                                                    onMouseEnter={playHover}
                                                >
                                                    <Music size={14} className="mr-2" />
                                                    <span className="hidden md:inline font-display">AUDIO</span>
                                                </CyberButton>
                                                <CyberButton
                                                    variant={activeModule === 'COMMS' ? 'primary' : 'ghost'}
                                                    className={`flex-1 text-[10px] md:text-xs py-3 ${activeModule === 'COMMS' ? 'text-amber-400 border-amber-500/50' : 'text-amber-200/70 hover:text-amber-100'}`}
                                                    onClick={() => { setActiveModule('COMMS'); playClick(); }}
                                                    onMouseEnter={playHover}
                                                >
                                                    <Radio size={14} className="mr-2" />
                                                    <span className="hidden md:inline font-display">COMMS</span>
                                                </CyberButton>
                                            </div>
                                        </div>
                                    </TechBorder>
                                </main>

                                {/* Right Sidebar - Hidden on Mobile */}
                                <motion.aside
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="hidden md:flex col-span-12 md:col-span-3 flex-col gap-6"
                                >
                                    <HoloCard variant="default" className="p-4 h-full relative overflow-hidden flex flex-col">
                                        <div className="text-[10px] tracking-[0.2em] uppercase text-white/70 mb-3 ml-1 font-display hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300 cursor-default">Spatial_Nav</div>
                                        <div className="flex-1">
                                            <StarmapNav activeId={activeModule} onNavigate={(id) => setActiveModule(id as 'HOME' | 'MISSION' | 'MEDIA' | 'COMMS' | 'COSMOS')} />
                                        </div>
                                    </HoloCard>

                                    <div className="grid grid-cols-1 gap-4">
                                        <StatCard label="Next Show" value="FEB 14" icon={Calendar} trend="Selling Fast" />
                                        <StatCard label="Location" value="NYC" icon={MapPin} />
                                    </div>

                                    {/* Command Input */}
                                    <TechBorder color="amber" cornerSize={8}>
                                        <div className="p-1 bg-black/60">
                                            <form onSubmit={onRun} className="flex items-center bg-black/40 rounded-lg px-3 py-2 border border-white/5 focus-within:border-cyan-500/30 transition-colors">
                                                <span className="text-cyan-500/70 mr-2">›</span>
                                                <input
                                                    ref={inputRef}
                                                    value={cmd}
                                                    onChange={e => { setCmd(e.target.value); playTyping(); }}
                                                    className="bg-transparent border-none outline-none text-[11px] font-mono text-white/80 w-full placeholder:text-white/20 uppercase"
                                                    placeholder="Type command..."
                                                />
                                            </form>
                                        </div>
                                    </TechBorder>
                                </motion.aside>

                            </div>
                        </div>
                    </TechBorder>
                </motion.div>

                {/* Disclaimer / Footer */}
                <div className="absolute bottom-2 md:bottom-4 left-0 right-0 text-[9px] text-white/20 tracking-wider uppercase text-center pointer-events-none">
                    SV - OS v4.5 // System Online
                </div>
            </div>
        </div>
    );
}
