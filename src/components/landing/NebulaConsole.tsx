'use client';

import React, { useEffect, useRef, useState } from "react";
import { Zap, Radio, Calendar, MapPin, Music, Activity, Globe } from "lucide-react";
import { SystemBar } from "@/components/bridge/SystemBar";
import { NebulaRadar } from "@/components/bridge/NebulaRadar";
import { StatCard } from "@/components/bridge/StatCard";
import { MusicPlayer } from "@/components/bridge/MusicPlayer";
import { CommsInterface } from "@/components/bridge/CommsInterface";
import { MissionLog } from "@/components/bridge/MissionLog";
import { CosmosMap } from "@/components/bridge/CosmosMap";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { ShipAmbience } from "@/components/effects/ShipAmbience";

type Log = { level: "INFO" | "WARN" | "OK" | "CRIT"; msg: string };

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

    const { playHover, playClick, playTyping, playSuccess, playError } = useSoundEffects();

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

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden text-white">
            {/* Cinematic Backdrop - Reduced opacity to see Starfield */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="absolute inset-0 cockpit-vignette" />
            <div className="absolute inset-0 scanlines pointer-events-none" />
            <div className="absolute inset-0 filmgrain pointer-events-none" />

            <ShipAmbience />

            <div className="relative h-full flex items-center justify-center p-2 md:p-4">
                {/* Main Console Frame */}
                <div className="w-full max-w-6xl cockpit-frame rounded-2xl md:rounded-[28px] p-2 md:p-4 flex flex-col h-full md:h-auto max-h-full">
                    <div className="cockpit-inner rounded-xl md:rounded-[22px] p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 flex-1 overflow-hidden">

                        {/* Left Sidebar - Hidden on Mobile */}
                        <aside className="hidden md:flex col-span-12 md:col-span-3 flex-col gap-4">
                            <div className="panel p-5 rounded-2xl space-y-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">Sys_Mon</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                                </div>
                                <SystemBar label="Network" value={signal} icon={Radio} />
                                <SystemBar label="Power" value={power} icon={Zap} />
                                <SystemBar label="Vibe" value={vibe} icon={Music} />
                                <SystemBar label="Sync" value={sync} icon={Activity} />
                            </div>

                            <div className="panel p-4 rounded-2xl flex-1 flex flex-col min-h-0">
                                <div className="text-sm tracking-[0.2em] uppercase text-white/50 mb-3">Log_Stream</div>
                                <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-4 font-mono text-sm pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                                    {logs.map((l, i) => (
                                        <div key={i} className="flex gap-2 leading-tight opacity-80">
                                            <span className={cx("shrink-0",
                                                l.level === "OK" ? "text-emerald-400" :
                                                    l.level === "WARN" ? "text-amber-400" :
                                                        l.level === "CRIT" ? "text-red-400" : "text-cyan-400"
                                            )}>{`[${l.level}]`}</span>
                                            <span className={`text-white/70 ${i === 0 ? 'typing-cursor' : ''}`}>{l.msg}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Center Main Module - Full Width on Mobile */}
                        <main className="col-span-1 md:col-span-6 flex flex-col gap-3 md:gap-4 h-full">
                            {/* Header Panel */}
                            <header className="panel p-4 md:p-6 rounded-2xl flex items-center justify-between shrink-0">
                                <div>
                                    <div className="text-[10px] tracking-[0.3em] uppercase text-cyan-300/70 mb-1">Bridge Console</div>
                                    <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-gradient glitch-text" data-text="LUNATHELOVEGOD">
                                        LUNATHELOVEGOD
                                    </h1>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <div className="text-[10px] tracking-widest uppercase text-white/40">Local Time</div>
                                    <div className="text-xl font-mono text-white/90">{now ? formatTime(now) : '00:00:00'}</div>
                                </div>
                            </header>

                            {/* Visualizer / Hero Area */}
                            <div className="flex-1 panel rounded-2xl p-1 relative overflow-hidden group flex items-center justify-center bg-black/40 min-h-0">
                                {activeModule === 'HOME' ? (
                                    <>
                                        {/* Warp Speed Background */}
                                        <div className="absolute inset-0 star-warp opacity-40 mix-blend-screen" />

                                        {/* Hero Image with Fade */}
                                        <div
                                            className="absolute inset-0 bg-[url('/images/console-hero-v2.jpg')] bg-cover bg-center opacity-60 mix-blend-lighten"
                                            style={{
                                                maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                                                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                                        {/* CSS Audio Visualizer - Deterministic */}
                                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
                                            {Array.from({ length: 20 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-2 bg-cyan-500/50 rounded-full waveform-bar"
                                                    style={{
                                                        animationDelay: `${i * 0.05}s`,
                                                        animationDuration: `${0.5 + ((i * 1337) % 100) / 100}s`,
                                                        height: `${20 + ((i * 997) % 60)}%`
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        <div className="relative z-10 text-center space-y-6 md:space-y-8 p-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                                <span className="text-[10px] tracking-widest uppercase text-cyan-200">System Ready</span>
                                            </div>

                                            <button
                                                onClick={handleEnter}
                                                onMouseEnter={playHover}
                                                disabled={isEntering}
                                                className={`btn-radioactive px-10 py-6 text-cyan-300 rounded-2xl transition-all duration-500 ${isEntering ? 'scale-110 brightness-150 border-cyan-400 bg-cyan-500/20' : ''}`}
                                            >
                                                <span className="text-lg font-bold tracking-[0.2em] uppercase">
                                                    {isEntering ? 'Engaging Warp...' : 'Enter Portal'}
                                                </span>
                                            </button>

                                            <div className="text-[10px] uppercase text-white/30 tracking-widest md:hidden animate-pulse">
                                                Tap to Initialize
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {activeModule === 'MISSION' && <MissionLog onClose={() => setActiveModule('HOME')} />}
                                        {activeModule === 'MEDIA' && <MusicPlayer onClose={() => setActiveModule('HOME')} />}
                                        {activeModule === 'COMMS' && <CommsInterface onClose={() => setActiveModule('HOME')} />}
                                        {activeModule === 'COSMOS' && <CosmosMap onClose={() => setActiveModule('HOME')} />}
                                    </>
                                )}
                            </div>

                            {/* Quick Actions - Visible but Compact on Mobile */}
                            <div className="grid grid-cols-4 gap-2 md:gap-3 shrink-0">
                                <button
                                    className="btn-console group"
                                    onClick={() => { setActiveModule('COSMOS'); playClick(); }}
                                    onMouseEnter={playHover}
                                >
                                    <span className="btn-dot bg-cyan-400" />
                                    <span className="group-hover:text-cyan-200 transition-colors hidden md:inline">Map</span>
                                    <span className="md:hidden text-[9px]"><Globe size={12} /></span>
                                </button>
                                <button
                                    className="btn-console group"
                                    onClick={() => { setActiveModule('MISSION'); playClick(); }}
                                    onMouseEnter={playHover}
                                >
                                    <span className="btn-dot" />
                                    <span className="group-hover:text-cyan-200 transition-colors hidden md:inline">Mission</span>
                                    <span className="md:hidden text-[9px]">Mission</span>
                                </button>
                                <button
                                    className="btn-console group"
                                    onClick={() => { setActiveModule('MEDIA'); playClick(); }}
                                    onMouseEnter={playHover}
                                >
                                    <span className="btn-dot btn-dot-mag" />
                                    <span className="group-hover:text-pink-200 transition-colors hidden md:inline">Media</span>
                                    <span className="md:hidden text-[9px]">Media</span>
                                </button>
                                <button
                                    className="btn-console group"
                                    onClick={() => { setActiveModule('COMMS'); playClick(); }}
                                    onMouseEnter={playHover}
                                >
                                    <span className="btn-dot btn-dot-amb" />
                                    <span className="group-hover:text-amber-200 transition-colors hidden md:inline">Comms</span>
                                    <span className="md:hidden text-[9px]">Comms</span>
                                </button>
                            </div>
                        </main>

                        {/* Right Sidebar - Hidden on Mobile */}
                        <aside className="hidden md:flex col-span-12 md:col-span-3 flex-col gap-4">
                            <div className="panel p-4 rounded-2xl">
                                <div className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-3 ml-1">Spatial_Nav</div>
                                <NebulaRadar />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <StatCard label="Next Show" value="FEB 14" icon={Calendar} trend="Selling Fast" />
                                <StatCard label="Location" value="NYC" icon={MapPin} />
                            </div>

                            {/* Command Input */}
                            <div className="panel p-1 rounded-xl mt-auto">
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
                        </aside>

                    </div>
                </div>

                {/* Disclaimer / Footer */}
                <div className="absolute bottom-2 md:bottom-4 left-0 right-0 text-[9px] text-white/20 tracking-wider uppercase text-center pointer-events-none">
                    SV - OS v4.5 // System Online
                </div>
            </div>
        </div>
    );
}
