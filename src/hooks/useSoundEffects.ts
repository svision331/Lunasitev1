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
        masterGain.gain.value = 0.6; // Slightly lower master to prevent clipping with layers
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

    // Track ambience nodes to allow crossfading/stopping
    const ambienceNodes = useRef<{
        rumble?: { source: OscillatorNode, gain: GainNode },
        drone?: { source: OscillatorNode, gain: GainNode }
    } | null>(null);

    const stopAmbience = useCallback(() => {
        if (!audioCtx || !ambienceNodes.current) return;

        const now = audioCtx.currentTime;
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
            stopAmbience();
        };
    }, [stopAmbience]);

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

    // Simple Tone Generator
    const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 1) => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const t = audioCtx.currentTime;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(vol, t + 0.02); // Faster attack
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(t + duration + 0.1);
    }, [isMuted]);

    // FM Synthesis Helper
    const playFM = useCallback((carrierFreq: number, modFreq: number, modDepth: number, duration: number, vol: number, type: OscillatorType = 'sine') => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;

        const t = audioCtx.currentTime;
        const carrier = audioCtx.createOscillator();
        const modulator = audioCtx.createOscillator();
        const modGain = audioCtx.createGain();
        const masterOut = audioCtx.createGain();

        carrier.type = type;
        carrier.frequency.setValueAtTime(carrierFreq, t);

        modulator.type = 'sine';
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
        carrier.stop(t + duration + 0.1);
        modulator.stop(t + duration + 0.1);
    }, [isMuted]);

    // -------------------------------------------------------------------------
    // AMBIENCE ENGINE
    // -------------------------------------------------------------------------
    const playAmbience = useCallback(async (url: string | 'synth', vol: number = 0.6) => {
        if (!initAudio() || !audioCtx || !masterGain) return;

        // Clean up checking is done inside the function, but good to be safe
        if (ambienceNodes.current) stopAmbience();

        if (isMuted) return;

        const t = audioCtx.currentTime;
        const fadeInDur = 3;

        // LAYER 1: Low Engine Rumble (Brownian-ish texture)
        const rumbleOsc = audioCtx.createOscillator();
        const rumbleMod = audioCtx.createOscillator();
        const rumbleModGain = audioCtx.createGain();
        const rumbleGain = audioCtx.createGain();

        rumbleOsc.type = 'sawtooth'; // Richer harmonics
        rumbleOsc.frequency.value = 50; // Deep bass

        rumbleMod.type = 'sine';
        rumbleMod.frequency.value = 0.5; // Very slow pulse
        rumbleModGain.gain.value = 10; // Subtle pitch drift

        rumbleMod.connect(rumbleModGain);
        rumbleModGain.connect(rumbleOsc.frequency);

        // Lowpass filter to muffle the sawtooth harshness
        const rumbleFilter = audioCtx.createBiquadFilter();
        rumbleFilter.type = 'lowpass';
        rumbleFilter.frequency.value = 120;
        rumbleFilter.Q.value = 1;

        rumbleOsc.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(masterGain);

        rumbleGain.gain.setValueAtTime(0, t);
        rumbleGain.gain.linearRampToValueAtTime(vol * 0.4, t + fadeInDur);

        rumbleOsc.start();
        rumbleMod.start();

        // LAYER 2: Ethereal Drone (High Space Wind)
        const droneOsc = audioCtx.createOscillator();
        const droneGain = audioCtx.createGain();

        droneOsc.type = 'sine';
        droneOsc.frequency.setValueAtTime(220, t); // A3
        // Slight detune/drift
        droneOsc.frequency.linearRampToValueAtTime(222, t + 10);

        // Stereo widening (illusion via gain modulation)
        const droneLFO = audioCtx.createOscillator();
        droneLFO.frequency.value = 0.1; // 10s cycle
        const droneLFOGain = audioCtx.createGain();
        droneLFOGain.gain.value = 0.05;

        droneLFO.connect(droneLFOGain);
        droneLFOGain.connect(droneGain.gain);

        droneOsc.connect(droneGain);
        droneGain.connect(masterGain);

        droneGain.gain.setValueAtTime(0, t);
        droneGain.gain.linearRampToValueAtTime(vol * 0.15, t + fadeInDur); // Quieter than rumble

        droneOsc.start();
        droneLFO.start();

        ambienceNodes.current = {
            rumble: { source: rumbleOsc, gain: rumbleGain },
            drone: { source: droneOsc, gain: droneGain }
        };

    }, [isMuted, stopAmbience]);

    // -------------------------------------------------------------------------
    // UI SOUNDS
    // -------------------------------------------------------------------------

    // 1. HOVER - Soft "Pip"
    const playHover = useCallback(() => {
        // High frequency, very short shine
        // Sine wave, 1200Hz, very short
        playTone(1200, 'sine', 0.03, 0.03);
    }, [playTone]);

    // 2. CLICK - Bi-tonal "Thud-Chirp"
    const playClick = useCallback(() => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;
        const t = audioCtx.currentTime;

        // Part A: Mechanical Thud (Low Sine)
        const thud = audioCtx.createOscillator();
        const thudGain = audioCtx.createGain();
        thud.frequency.setValueAtTime(150, t);
        thud.frequency.exponentialRampToValueAtTime(50, t + 0.1);
        thudGain.gain.setValueAtTime(0.5, t);
        thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        thud.connect(thudGain);
        thudGain.connect(masterGain);
        thud.start();
        thud.stop(t + 0.15);

        // Part B: Digital Chirp (High filtered noise or high sine)
        // Using a high sine zap
        const chirp = audioCtx.createOscillator();
        const chirpGain = audioCtx.createGain();
        chirp.frequency.setValueAtTime(2000, t);
        chirp.frequency.exponentialRampToValueAtTime(4000, t + 0.05);
        chirpGain.gain.setValueAtTime(0.05, t); // Quiet
        chirpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        chirp.connect(chirpGain);
        chirpGain.connect(masterGain);
        chirp.start();
        chirp.stop(t + 0.1);

    }, [isMuted]);

    // 3. ERROR - Power Down
    const playError = useCallback(() => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;
        // Descending low tone
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.4);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(t + 0.5);
    }, [isMuted]);

    // 4. SUCCESS - Ethereal Wash
    const playSuccess = useCallback(() => {
        if (isMuted || !initAudio() || !audioCtx || !masterGain) return;
        const t = audioCtx.currentTime;

        // C Major 9 chord: C4, E4, G4, B4, D5 (approx)
        const freqs = [261.63, 329.63, 392.00, 493.88, 587.33];

        freqs.forEach((f, i) => {
            const osc = audioCtx!.createOscillator();
            const gain = audioCtx!.createGain();

            osc.type = 'sine';
            osc.frequency.value = f;

            // Staggered entry
            const start = t + (i * 0.05);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.1, start + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 1.5); // Long release

            osc.connect(gain);
            gain.connect(masterGain!);
            osc.start(start);
            osc.stop(start + 2);
        });
    }, [isMuted]);

    // 5. TYPING - Organic Taps
    const playTyping = useCallback(() => {
        // Random pitch variation to sound organic
        // Base freq ~800Hz, +/- 100Hz
        const base = 800;
        const variance = (Math.random() * 200) - 100;
        const freq = base + variance;

        // Random volume variance
        const vol = 0.05 + (Math.random() * 0.05);

        // Very short blip, triangle wave for "body"
        playTone(freq, 'triangle', 0.03, vol);
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
            const target = isMuted ? 0.6 : 0;
            masterGain.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.1);
        }
    }, [isMuted]);

    return {
        playHover,
        playClick,
        playError,
        playSuccess,
        playTyping,
        playWarp,
        playSample,
        playAmbience,
        toggleMute,
        isMuted
    };
};
