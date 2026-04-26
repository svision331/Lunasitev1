'use client';

import { useState, useEffect, useRef } from 'react';

// Set your launch date here
const LAUNCH_DATE = new Date('2026-09-01T00:00:00');


function useCountdown(target: Date) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calc = () => {
            const diff = target.getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [target]);

    return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
    const [flip, setFlip] = useState(false);
    const prev = useRef(value);

    useEffect(() => {
        if (prev.current !== value) {
            const t1 = setTimeout(() => setFlip(true), 0);
            const t2 = setTimeout(() => setFlip(false), 600);
            prev.current = value;
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
    }, [value]);

    const display = String(value).padStart(2, '0');

    return (
        <div className="flex flex-col items-center gap-3">
            <div className={`countdown-digit relative w-20 h-24 sm:w-28 sm:h-32 md:w-36 md:h-40 flex items-center justify-center overflow-hidden ${flip ? 'flip' : ''}`}>
                {/* Top half shine */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />
                {/* Center divider */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-black/40 z-20" />

                <span
                    className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-cyan-300 tabular-nums"
                    style={{ textShadow: '0 0 20px rgba(6,182,212,0.8), 0 0 40px rgba(6,182,212,0.4)' }}
                >
                    {display}
                </span>
            </div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-400 font-mono">
                {label}
            </span>
        </div>
    );
}

function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let raf: number;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const stars = Array.from({ length: 200 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.5 + 0.2,
            speed: Math.random() * 0.3 + 0.05,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.005,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                s.opacity += s.twinkleSpeed;
                if (s.opacity > 1 || s.opacity < 0) s.twinkleSpeed *= -1;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${Math.abs(s.opacity)})`;
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default function LaunchingSoonPage() {
    const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setErrorMsg('Please enter a valid email address.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                const data = await res.json();
                setErrorMsg(data.error || 'Something went wrong. Try again.');
                setStatus('error');
            }
        } catch {
            setErrorMsg('Connection failed. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
            {/* Animated starfield */}
            <StarField />

            {/* Deep space nebula gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, oklch(0.55 0.22 280) 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, oklch(0.65 0.26 320) 0%, transparent 70%)' }} />
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, oklch(0.7 0.22 220) 0%, transparent 70%)' }} />
            </div>

            {/* Scanlines */}
            <div className="absolute inset-0 scanlines pointer-events-none opacity-10" />

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl w-full">

                {/* Signal indicator */}
                <div className="flex items-center gap-2 mb-10 text-cyan-400 font-mono text-xs uppercase tracking-[0.3em]">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]" />
                    Signal Incoming
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]" />
                </div>

                {/* Artist name */}
                <h1
                    className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-4 text-gradient"
                    style={{
                        fontFamily: 'var(--font-display, "Share Tech Mono", monospace)',
                        textShadow: '0 0 80px rgba(6,182,212,0.3)',
                    }}
                >
                    LUNATHELOVEGOD
                </h1>

                <p className="text-slate-400 font-mono text-sm sm:text-base tracking-[0.2em] uppercase mb-3">
                    Ice Giant Lover Girl
                </p>

                <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-10 opacity-60" />

                {/* Teaser text */}
                <p className="text-slate-300 text-base sm:text-lg max-w-xl mb-14 leading-relaxed font-mono opacity-80">
                    A new transmission is being prepared.<br />
                    The void opens soon. Be ready.
                </p>

                {/* Countdown */}
                <div className="flex items-start gap-4 sm:gap-6 md:gap-10 mb-16">
                    <CountdownUnit value={days} label="Days" />
                    <div className="text-cyan-400 text-4xl sm:text-5xl md:text-6xl font-mono mt-6 sm:mt-8 opacity-60 animate-pulse">:</div>
                    <CountdownUnit value={hours} label="Hours" />
                    <div className="text-cyan-400 text-4xl sm:text-5xl md:text-6xl font-mono mt-6 sm:mt-8 opacity-60 animate-pulse">:</div>
                    <CountdownUnit value={minutes} label="Minutes" />
                    <div className="text-cyan-400 text-4xl sm:text-5xl md:text-6xl font-mono mt-6 sm:mt-8 opacity-60 animate-pulse">:</div>
                    <CountdownUnit value={seconds} label="Seconds" />
                </div>

                {/* Email signup */}
                {status === 'success' ? (
                    <div className="glass rounded-2xl px-8 py-6 max-w-md w-full border border-cyan-400/30 text-center">
                        <div className="w-10 h-10 rounded-full bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-cyan-300 font-mono text-sm uppercase tracking-widest mb-1">Transmission Received</p>
                        <p className="text-slate-400 font-mono text-xs">You&apos;re on the list. We&apos;ll notify you when the signal goes live.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full max-w-md">
                        <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                            Join the mailing list — be first to enter the void
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <input
                                    id="waitlist-email"
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setStatus('idle'); setErrorMsg(''); }}
                                    placeholder="your@email.com"
                                    disabled={status === 'loading'}
                                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/60 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-600 outline-none transition-all duration-300 hover:border-white/20"
                                    style={{ backdropFilter: 'blur(12px)' }}
                                    autoComplete="email"
                                />
                            </div>
                            <button
                                type="submit"
                                id="waitlist-submit"
                                disabled={status === 'loading'}
                                className="glow-button px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-widest text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                <span>
                                    {status === 'loading' ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : 'Notify Me'}
                                </span>
                            </button>
                        </div>

                        {status === 'error' && (
                            <p className="text-red-400 font-mono text-xs mt-2 text-left">{errorMsg}</p>
                        )}
                    </form>
                )}

                {/* Footer */}
                <div className="mt-20 flex flex-col items-center gap-3">
                    <div className="w-px h-10 bg-gradient-to-b from-transparent to-cyan-400/30" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-slate-600">
                        LUNA OS V4.0 // SIGNAL INITIALIZING
                    </p>
                </div>
            </div>
        </div>
    );
}
