'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

// Types
type SoundContextType = {
    isMuted: boolean;
    toggleMute: () => void;
    playHover: () => void;
    playClick: () => void;
    playError: () => void;
    playSuccess: () => void;
    playTyping: () => void;
    playWarp: () => void;
    playSample: (url: string, vol?: number) => Promise<void>;
    playAmbience: (url: string | 'synth', vol?: number) => Promise<void>;
    audioContext: AudioContext | null;
    masterGain: GainNode | null;
};

const SoundContext = createContext<SoundContextType | null>(null);

// Singleton AudioContext (outside component to persist across re-renders if provider stays alive)
// However, putting it in ref is safer for React lifecycle.
let globalAudioCtx: AudioContext | null = null;
let globalMasterGain: GainNode | null = null;

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('luna_sound_muted');
            return stored ? JSON.parse(stored) : false;
        }
        return false;
    });

    // Ambience nodes ref
    const ambienceNodes = useRef<{
        rumble?: { source: OscillatorNode, gain: GainNode },
        drone?: { source: OscillatorNode, gain: GainNode }
    } | null>(null);

    // Initialize Audio Context (must be triggered by user gesture)
    const initAudio = useCallback(() => {
        if (typeof window === 'undefined') return null;
        if (!globalAudioCtx) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Ctx = window.AudioContext || (window as any).webkitAudioContext;
            if (!Ctx) return null;

            globalAudioCtx = new Ctx();
            globalMasterGain = globalAudioCtx.createGain();
            globalMasterGain.gain.value = isMuted ? 0 : 0.6;
            globalMasterGain.connect(globalAudioCtx.destination);
        }
        if (globalAudioCtx.state === 'suspended') {
            globalAudioCtx.resume();
        }
        return globalAudioCtx;
    }, [isMuted]);

    // Update master gain when isMuted changes (not initial hydration)
    useEffect(() => {
        if (globalMasterGain) {
            globalMasterGain.gain.value = isMuted ? 0 : 0.6;
        }
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted((prev: boolean) => {
            const next = !prev;
            console.log("🔊 Toggling Mute:", next ? "MUTED" : "UNMUTED");
            localStorage.setItem('luna_sound_muted', JSON.stringify(next));

            // Ensure context is running
            if (globalAudioCtx?.state === 'suspended') {
                globalAudioCtx.resume();
            }

            if (globalMasterGain && globalAudioCtx) {
                const target = next ? 0 : 0.6;
                // Cancel scheduled values to force immediate change if needed
                globalMasterGain.gain.cancelScheduledValues(globalAudioCtx.currentTime);
                globalMasterGain.gain.linearRampToValueAtTime(target, globalAudioCtx.currentTime + 0.1);
            }
            return next;
        });
    }, []);

    // ... [Insert all sound generation functions here: playTone, playHover, etc.] ...
    // Adapted from useSoundEffects.ts to use globalAudioCtx and globalMasterGain

    // Helper: Play Tone
    const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 1) => {
        if (isMuted || !initAudio() || !globalAudioCtx || !globalMasterGain) return;
        const ctx = globalAudioCtx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const t = ctx.currentTime;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(vol, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(gain);
        gain.connect(globalMasterGain);

        osc.start();
        osc.stop(t + duration + 0.1);
    }, [isMuted, initAudio]);

    const playHover = useCallback(() => {
        playTone(1200, 'sine', 0.03, 0.03);
    }, [playTone]);

    const playClick = useCallback(() => {
        if (isMuted || !initAudio() || !globalAudioCtx || !globalMasterGain) return;
        const ctx = globalAudioCtx;
        const t = ctx.currentTime;

        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.frequency.setValueAtTime(150, t);
        thud.frequency.exponentialRampToValueAtTime(50, t + 0.1);
        thudGain.gain.setValueAtTime(0.5, t);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        thud.connect(thudGain);
        thudGain.connect(globalMasterGain);
        thud.start();
        thud.stop(t + 0.15);

        const chirp = ctx.createOscillator();
        const chirpGain = ctx.createGain();
        chirp.frequency.setValueAtTime(2000, t);
        chirp.frequency.exponentialRampToValueAtTime(4000, t + 0.05);
        chirpGain.gain.setValueAtTime(0.05, t);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        chirp.connect(chirpGain);
        chirpGain.connect(globalMasterGain);
        chirp.start();
        chirp.stop(t + 0.1);
    }, [isMuted, initAudio]);

    const playError = useCallback(() => {
        if (isMuted || !initAudio() || !globalAudioCtx || !globalMasterGain) return;
        const ctx = globalAudioCtx;
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.4);

        osc.connect(gain);
        gain.connect(globalMasterGain);
        osc.start();
        osc.stop(t + 0.5);
    }, [isMuted, initAudio]);

    const playSuccess = useCallback(() => {
        if (isMuted || !initAudio() || !globalAudioCtx || !globalMasterGain) return;
        const ctx = globalAudioCtx;
        const t = ctx.currentTime;
        const freqs = [261.63, 329.63, 392.00, 493.88, 587.33];

        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            const start = t + (i * 0.05);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.1, start + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 1.5);
            osc.connect(gain);
            gain.connect(globalMasterGain!);
            osc.start(start);
            osc.stop(start + 2);
        });
    }, [isMuted, initAudio]);

    const playTyping = useCallback(() => {
        const base = 800;
        const variance = (Math.random() * 200) - 100;
        const freq = base + variance;
        const vol = 0.05 + (Math.random() * 0.05);
        playTone(freq, 'triangle', 0.03, vol);
    }, [playTone]);

    const playWarp = useCallback(() => {
        if (isMuted || !initAudio() || !globalAudioCtx || !globalMasterGain) return;
        const ctx = globalAudioCtx;
        const t = ctx.currentTime;
        const duration = 4.0;

        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        const noiseFilter = ctx.createBiquadFilter();
        const noiseGain = ctx.createGain();

        noise.buffer = buffer;
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(100, t);
        noiseFilter.frequency.exponentialRampToValueAtTime(8000, t + duration * 0.8);
        noiseFilter.Q.value = 1;

        noiseGain.gain.setValueAtTime(0, t);
        noiseGain.gain.linearRampToValueAtTime(0.5, t + 1);
        noiseGain.gain.linearRampToValueAtTime(0, t + duration);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(globalMasterGain);
        noise.start();

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const engineGain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(50, t);
        osc1.frequency.exponentialRampToValueAtTime(400, t + duration);
        osc2.frequency.setValueAtTime(55, t);
        osc2.frequency.exponentialRampToValueAtTime(408, t + duration);

        engineGain.gain.setValueAtTime(0, t);
        engineGain.gain.linearRampToValueAtTime(0.3, t + 0.5);
        engineGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc1.connect(engineGain);
        osc2.connect(engineGain);
        engineGain.connect(globalMasterGain);
        osc1.start();
        osc2.start();
        osc1.stop(t + duration);
        osc2.stop(t + duration);
    }, [isMuted, initAudio]);

    const stopAmbience = useCallback(() => {
        if (!globalAudioCtx || !ambienceNodes.current) return;
        const ctx = globalAudioCtx;
        const now = ctx.currentTime;
        const rampTime = 2;

        if (ambienceNodes.current.rumble) {
            const { source, gain } = ambienceNodes.current.rumble;
            try {
                gain.gain.exponentialRampToValueAtTime(0.001, now + rampTime);
                source.stop(now + rampTime);
            } catch (e) { console.warn(e); }
        }
        if (ambienceNodes.current.drone) {
            const { source, gain } = ambienceNodes.current.drone;
            try {
                gain.gain.exponentialRampToValueAtTime(0.001, now + rampTime);
                source.stop(now + rampTime);
            } catch (e) { console.warn(e); }
        }
        ambienceNodes.current = null;
    }, []);

    const playAmbience = useCallback(async (url: string | 'synth', vol: number = 0.6) => {
        if (!initAudio() || !globalAudioCtx || !globalMasterGain) return;

        if (ambienceNodes.current) stopAmbience();
        if (isMuted) return;

        const ctx = globalAudioCtx;
        const t = ctx.currentTime;
        const fadeInDur = 3;

        const rumbleOsc = ctx.createOscillator();
        const rumbleMod = ctx.createOscillator();
        const rumbleModGain = ctx.createGain();
        const rumbleGain = ctx.createGain();

        rumbleOsc.type = 'sawtooth';
        rumbleOsc.frequency.value = 50;
        rumbleMod.type = 'sine';
        rumbleMod.frequency.value = 0.5;
        rumbleModGain.gain.value = 10;
        rumbleMod.connect(rumbleModGain);
        rumbleModGain.connect(rumbleOsc.frequency);

        const rumbleFilter = ctx.createBiquadFilter();
        rumbleFilter.type = 'lowpass';
        rumbleFilter.frequency.value = 120;
        rumbleFilter.Q.value = 1;

        rumbleOsc.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(globalMasterGain);

        rumbleGain.gain.setValueAtTime(0, t);
        rumbleGain.gain.linearRampToValueAtTime(vol * 0.4, t + fadeInDur);

        rumbleOsc.start();
        rumbleMod.start();

        const droneOsc = ctx.createOscillator();
        const droneGain = ctx.createGain();
        droneOsc.type = 'sine';
        droneOsc.frequency.setValueAtTime(220, t);
        droneOsc.frequency.linearRampToValueAtTime(222, t + 10);

        const droneLFO = ctx.createOscillator();
        droneLFO.frequency.value = 0.1;
        const droneLFOGain = ctx.createGain();
        droneLFOGain.gain.value = 0.05;
        droneLFO.connect(droneLFOGain);
        droneLFOGain.connect(droneGain.gain);

        droneOsc.connect(droneGain);
        droneGain.connect(globalMasterGain);

        droneGain.gain.setValueAtTime(0, t);
        droneGain.gain.linearRampToValueAtTime(vol * 0.15, t + fadeInDur);

        droneOsc.start();
        droneLFO.start();

        ambienceNodes.current = {
            rumble: { source: rumbleOsc, gain: rumbleGain },
            drone: { source: droneOsc, gain: droneGain }
        };
    }, [isMuted, stopAmbience, initAudio]);

    const playSample = useCallback(async (url: string) => {
        if (isMuted || !initAudio() || !globalAudioCtx || !globalMasterGain) return;
        // Implementation for sample playing if needed, similar to original hook
        // For now, focusing on the synth sounds used in the app
        console.log('Sample playback not fully migrated for:', url);
    }, [isMuted, initAudio]);


    // Interactivity Listener
    useEffect(() => {
        const handleInteract = () => {
            initAudio();
            window.removeEventListener('click', handleInteract);
            window.removeEventListener('keydown', handleInteract);
        };
        window.addEventListener('click', handleInteract);
        window.addEventListener('keydown', handleInteract);
        return () => {
            window.removeEventListener('click', handleInteract);
            window.removeEventListener('keydown', handleInteract);
            stopAmbience();
        };
    }, [initAudio, stopAmbience]);

    return (
        <SoundContext.Provider value={{
            isMuted,
            toggleMute,
            playHover,
            playClick,
            playError,
            playSuccess,
            playTyping,
            playWarp,
            playSample,
            playAmbience,
            audioContext: globalAudioCtx,
            masterGain: globalMasterGain
        }}>
            {children}
        </SoundContext.Provider>
    );
}

export const useSoundEffects = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSoundEffects must be used within a SoundProvider');
    }
    return context;
};
