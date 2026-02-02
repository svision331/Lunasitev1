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

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }, [isMuted]);

    // FM Synthesis Helper for Sci-Fi Textures
    const playFM = useCallback((carrierFreq: number, modFreq: number, modDepth: number, duration: number, vol: number) => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;

        const t = audioCtx.currentTime;
        const carrier = audioCtx.createOscillator();
        const modulator = audioCtx.createOscillator();
        const modGain = audioCtx.createGain();
        const masterOut = audioCtx.createGain();

        carrier.frequency.setValueAtTime(carrierFreq, t);
        modulator.frequency.setValueAtTime(modFreq, t);
        modGain.gain.setValueAtTime(modDepth, t);

        modulator.connect(modGain);
        modGain.connect(carrier.frequency);

        masterOut.gain.setValueAtTime(0, t);
        masterOut.gain.linearRampToValueAtTime(vol, t + 0.01);
        masterOut.gain.exponentialRampToValueAtTime(0.001, t + duration);

        carrier.connect(masterOut);
        masterOut.connect(masterGain);

        carrier.start();
        modulator.start();
        carrier.stop(t + duration);
        modulator.stop(t + duration);
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

    // 1. DATA FLUTTER (Hover)
    // High-speed LFO on a carrier to simulate data processing
    const playHover = useCallback(() => {
        // Carrier: 2000Hz, Modulator: 40Hz (flutter), Depth: 200
        playFM(2000, 40, 200, 0.05, 0.05);
    }, [playFM]);

    // 2. SERVO CLICK (Interaction)
    // Quick frequency sweep (chirp)
    const playClick = useCallback(() => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;
        const t = audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.1); // Pitch Drop

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, t);
        filter.frequency.linearRampToValueAtTime(500, t + 0.1); // Filter Close

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(t + 0.1);
    }, [isMuted]);

    // 3. GLITCH (Error)
    // Dissonant FM
    const playError = useCallback(() => {
        // Carrier: 150Hz, Modulator: 25Hz (Roughness), Depth: 500
        playFM(150, 25, 500, 0.3, 0.2);
    }, [playFM]);

    // 4. HARMONIC CHORD (Success)
    // Major 7th Chord
    const playSuccess = useCallback(() => {
        const chord = [440, 554.37, 659.25, 830.61]; // A Major 7
        chord.forEach((freq, i) => {
            setTimeout(() => {
                playTone(freq, 'sine', 0.4, 0.1);
            }, i * 40);
        });
        // Add a high sparkle at the end
        setTimeout(() => playFM(2000, 50, 500, 0.5, 0.05), 300);
    }, [playTone, playFM]);

    // 5. DATA CHIRP (Typing)
    // random high pitch blips
    const playTyping = useCallback(() => {
        const freq = 1500 + Math.random() * 2000;
        playTone(freq, 'square', 0.03, 0.05);
    }, [playTone]);

    // 6. WARP DRIVE (Transition)
    // Complex sequence: Noise Sweep + Engine Spool Up
    const playWarp = useCallback(() => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;
        const t = audioCtx.currentTime;
        const duration = 4.0; // Match the visual transition roughly

        // Layer A: Noise Sweep (The "Whoosh")
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; // White Noise
        }

        const noise = audioCtx.createBufferSource();
        const noiseFilter = audioCtx.createBiquadFilter();
        const noiseGain = audioCtx.createGain();

        noise.buffer = buffer;
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(100, t);
        noiseFilter.frequency.exponentialRampToValueAtTime(8000, t + duration * 0.8); // Sweep up
        noiseFilter.Q.value = 1;

        noiseGain.gain.setValueAtTime(0, t);
        noiseGain.gain.linearRampToValueAtTime(0.5, t + 1);
        noiseGain.gain.linearRampToValueAtTime(0, t + duration);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.start();

        // Layer B: Engine Spool (Rising Tone)
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const engineGain = audioCtx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(50, t);
        osc1.frequency.exponentialRampToValueAtTime(400, t + duration);

        osc2.frequency.setValueAtTime(55, t); // Detuned
        osc2.frequency.exponentialRampToValueAtTime(408, t + duration);

        engineGain.gain.setValueAtTime(0, t);
        engineGain.gain.linearRampToValueAtTime(0.3, t + 0.5);
        engineGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc1.connect(engineGain);
        osc2.connect(engineGain);
        engineGain.connect(masterGain);

        osc1.start();
        osc2.start();
        osc1.stop(t + duration);
        osc2.stop(t + duration);
    }, [isMuted]);

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
        playWarp, // Exported
        playSample,
        playAmbience,
        toggleMute,
        isMuted
    };
};
