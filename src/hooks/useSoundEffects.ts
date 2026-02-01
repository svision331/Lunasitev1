import { useCallback, useEffect, useRef, useState } from 'react';

// Singleton AudioContext to reuse across the app
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

// Initialize context lazily (usually on first user interaction)
const initAudio = () => {
    if (!authAudio()) return null;
    return audioCtx;
};

const authAudio = () => {
    if (typeof window === 'undefined') return false;
    if (!audioCtx) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return false;

        audioCtx = new Ctx();
        masterGain = audioCtx!.createGain();
        masterGain.gain.value = 0.7; // Boost Master volume
        masterGain.connect(audioCtx!.destination);
    }
    if (audioCtx?.state === 'suspended') {
        audioCtx.resume();
    }
    return true;
};

export const useSoundEffects = () => {
    const [isMuted, setIsMuted] = useState(false);
    const audioCache = useRef<Map<string, AudioBuffer>>(new Map());
    const ambienceNodes = useRef<{ source: AudioBufferSourceNode | OscillatorNode, gain: GainNode } | null>(null);

    // Ensure audio context is ready on mount/interaction
    useEffect(() => {
        const handleInteract = () => {
            initAudio();
            // Remove listener after first interaction
            window.removeEventListener('click', handleInteract);
            window.removeEventListener('keydown', handleInteract);
        };

        window.addEventListener('click', handleInteract);
        window.addEventListener('keydown', handleInteract);
        return () => {
            window.removeEventListener('click', handleInteract);
            window.removeEventListener('keydown', handleInteract);
            // Cleanup ambience on unmount
            if (ambienceNodes.current) {
                try {
                    ambienceNodes.current.source.stop();
                } catch (_e) { }
            }
        };
    }, []);

    const loadBuffer = async (url: string): Promise<AudioBuffer | null> => {
        if (!initAudio() || !audioCtx) return null;
        if (audioCache.current.has(url)) return audioCache.current.get(url)!;

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            audioCache.current.set(url, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.error(`Failed to load sound: ${url}`, error);
            return null;
        }
    };

    const playSample = useCallback(async (url: string, vol: number = 0.5) => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;

        const buffer = await loadBuffer(url);
        if (!buffer) return;

        const source = audioCtx.createBufferSource();
        const gain = audioCtx.createGain();

        source.buffer = buffer;
        gain.gain.value = vol;

        source.connect(gain);
        gain.connect(masterGain);
        source.start();
    }, [isMuted]);

    const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 1) => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Envelope
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }, [isMuted]);

    const playAmbience = useCallback(async (url: string | 'synth', vol: number = 0.8) => {
        if (!initAudio() || !audioCtx || !masterGain) return;

        // Stop previous ambience
        if (ambienceNodes.current) {
            const { source, gain } = ambienceNodes.current;
            // Fade out
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
            source.stop(audioCtx.currentTime + 1);
            ambienceNodes.current = null;
        }

        if (isMuted) return;

        const gain = audioCtx.createGain();
        gain.gain.value = 0;
        gain.connect(masterGain);

        let source: AudioBufferSourceNode | OscillatorNode;

        if (url === 'synth') {
            // Synthesized Spaceship Hum (Brownian Noise approx with low freq osc)
            // Using FM synthesis for a "engine" thrum
            const osc = audioCtx.createOscillator();
            const mod = audioCtx.createOscillator();
            const modGain = audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.value = 60; // Low rumble

            mod.type = 'sine';
            mod.frequency.value = 2; // Throbbing effect

            modGain.gain.value = 30;

            mod.connect(modGain);
            modGain.connect(osc.frequency);
            osc.connect(gain);

            osc.start();
            mod.start();
            source = osc;
        } else {
            const buffer = await loadBuffer(url);
            if (!buffer) return;

            source = audioCtx.createBufferSource();
            (source as AudioBufferSourceNode).buffer = buffer;
            (source as AudioBufferSourceNode).loop = true;
            source.connect(gain);
            source.start();
        }

        // Fade in
        gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 2);
        ambienceNodes.current = { source, gain };

    }, [isMuted]);

    const playHover = useCallback(() => {
        playTone(2000, 'sine', 0.05, 0.1);
    }, [playTone]);

    const playClick = useCallback(() => {
        playTone(1200, 'square', 0.05, 0.2);
        setTimeout(() => playTone(600, 'triangle', 0.1, 0.2), 20);
    }, [playTone]);

    const playError = useCallback(() => {
        playTone(150, 'sawtooth', 0.3, 0.3);
    }, [playTone]);

    const playSuccess = useCallback(() => {
        // const now = audioCtx?.currentTime || 0; // Removed unused variable
        [440, 554, 659, 880].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'sine', 0.2, 0.2), i * 50);
        });
    }, [playTone]);

    const playTyping = useCallback(() => {
        const drift = Math.random() * 200 - 100;
        playTone(3000 + drift, 'square', 0.02, 0.05);
    }, [playTone]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
        if (masterGain && audioCtx) {
            // Smooth mute
            const target = isMuted ? 0.3 : 0; // Unmute to 0.3, Mute to 0
            masterGain.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.1);
        }
    }, [isMuted]);

    return {
        playHover,
        playClick,
        playError,
        playSuccess,
        playTyping,
        playSample,
        playAmbience,
        toggleMute,
        isMuted
    };
};
