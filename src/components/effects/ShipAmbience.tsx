'use client';

import { useEffect, useRef } from 'react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export function ShipAmbience() {
    const { audioContext, masterGain } = useSoundEffects();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodesRef = useRef<any[]>([]);

    useEffect(() => {
        if (!audioContext || !masterGain) return;

        const ctx = audioContext;
        // Check if context is valid
        if (ctx.state === 'closed') return;

        const createNoiseBuffer = (c: AudioContext) => {
            const bufferSize = c.sampleRate * 2; // 2 seconds
            const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
            const output = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            return buffer;
        };

        const stopLayers = () => {
            nodesRef.current.forEach(node => {
                try {
                    node.stop();
                    node.disconnect();
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (_e) { }
            });
            nodesRef.current = [];
        };

        // We need to store cleanup functions for timeouts
        let cleanupBeep: (() => void) | undefined;
        let cleanupCreak: (() => void) | undefined;

        const setupLayers = (c: AudioContext, dest: AudioNode) => {
            // Clear old nodes
            stopLayers();

            const noiseBuffer = createNoiseBuffer(c);
            const t = c.currentTime;

            // --- 1. Core Ship Ambience (Deep Brown/Pink Noise Bed) ---
            const bedSrc = c.createBufferSource();
            bedSrc.buffer = noiseBuffer;
            bedSrc.loop = true;
            const bedFilter = c.createBiquadFilter();
            bedFilter.type = 'lowpass';
            bedFilter.frequency.value = 120;
            const bedGain = c.createGain();
            bedGain.gain.value = 0.5;
            bedSrc.connect(bedFilter).connect(bedGain).connect(dest);
            bedSrc.start(t);
            nodesRef.current.push(bedSrc);

            // --- 2. Reactor Hum (Sub-bass pulse) ---
            const reactOsc = c.createOscillator();
            reactOsc.type = 'sawtooth';
            reactOsc.frequency.value = 55;
            const reactFilter = c.createBiquadFilter();
            reactFilter.type = 'lowpass';
            reactFilter.frequency.value = 80;
            const reactGain = c.createGain();
            reactGain.gain.value = 0.15;

            // LFO for Reactor Pulse
            const lfo = c.createOscillator();
            lfo.frequency.value = 0.5; // Slow pulse
            const lfoGain = c.createGain();
            lfoGain.gain.value = 20; // Modulate filter freq
            lfo.connect(lfoGain).connect(reactFilter.frequency);

            reactOsc.connect(reactFilter).connect(reactGain).connect(dest);
            reactOsc.start(t);
            lfo.start(t);
            nodesRef.current.push(reactOsc, lfo);

            // --- 3. Life Support (Hiss/Airflow) ---
            const airSrc = c.createBufferSource();
            airSrc.buffer = noiseBuffer;
            airSrc.loop = true;
            const airFilter = c.createBiquadFilter();
            airFilter.type = 'bandpass';
            airFilter.frequency.value = 800;
            airFilter.Q.value = 1;
            const airGain = c.createGain();
            airGain.gain.value = 0.05;

            // Breathing LFO
            const breathLfo = c.createOscillator();
            breathLfo.frequency.value = 0.1; // Very slow breath
            const breathGain = c.createGain();
            breathGain.gain.value = 0.02;
            breathLfo.connect(breathGain).connect(airGain.gain);

            airSrc.connect(airFilter).connect(airGain).connect(dest);
            airSrc.start(t);
            breathLfo.start(t);
            nodesRef.current.push(airSrc, breathLfo);

            // --- 4. Artificial Gravity (Sub-bass stabilized) ---
            const gravOsc = c.createOscillator();
            gravOsc.type = 'sine';
            gravOsc.frequency.value = 32; // Deep sub
            const gravGain = c.createGain();
            gravGain.gain.value = 0.3;
            gravOsc.connect(gravGain).connect(dest);
            gravOsc.start(t);
            nodesRef.current.push(gravOsc);

            // --- 5. Console Tones (Random Beeps) ---
            const scheduleBeep = () => {
                if (c.state === 'closed') return;
                const osc = c.createOscillator();
                const g = c.createGain();
                const now = c.currentTime;

                osc.frequency.value = 2000 + Math.random() * 1000;
                osc.type = 'sine';

                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.02, now + 0.05);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

                osc.connect(g).connect(dest);
                osc.start(now);
                osc.stop(now + 0.3);

                const id = setTimeout(scheduleBeep, 2000 + Math.random() * 5000);
                cleanupBeep = () => clearTimeout(id);
            };
            scheduleBeep();

            // --- 6. Hull Creaks (Metal Groans) ---
            const scheduleCreak = () => {
                if (c.state === 'closed') return;
                const creakSrc = c.createBufferSource();
                creakSrc.buffer = noiseBuffer;
                const filter = c.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 100 + Math.random() * 100;
                filter.Q.value = 5;
                const g = c.createGain();
                const now = c.currentTime;

                const duration = 1 + Math.random() * 2;
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.05, now + duration * 0.2);
                g.gain.linearRampToValueAtTime(0, now + duration);

                creakSrc.connect(filter).connect(g).connect(dest);
                creakSrc.start(now);
                creakSrc.stop(now + duration + 0.5);

                const id = setTimeout(scheduleCreak, 5000 + Math.random() * 10000);
                cleanupCreak = () => clearTimeout(id);
            };
            scheduleCreak();
        };

        setupLayers(ctx, masterGain);

        return () => {
            stopLayers();
            if (cleanupBeep) cleanupBeep();
            if (cleanupCreak) cleanupCreak();
        };
    }, [audioContext, masterGain]); // Re-run when context becomes available

    return null;
}
