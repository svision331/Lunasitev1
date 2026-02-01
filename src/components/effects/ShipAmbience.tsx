'use client';

import { useEffect, useRef } from 'react';

export function ShipAmbience() {
    const contextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodesRef = useRef<any[]>([]);

    useEffect(() => {
        const createNoiseBuffer = (ctx: AudioContext) => {
            const bufferSize = ctx.sampleRate * 2; // 2 seconds
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
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

        const setupLayers = (ctx: AudioContext, dest: AudioNode) => {
            // Clear old nodes
            stopLayers();

            const noiseBuffer = createNoiseBuffer(ctx);
            const t = ctx.currentTime;

            // --- 1. Core Ship Ambience (Deep Brown/Pink Noise Bed) ---
            const bedSrc = ctx.createBufferSource();
            bedSrc.buffer = noiseBuffer;
            bedSrc.loop = true;
            const bedFilter = ctx.createBiquadFilter();
            bedFilter.type = 'lowpass';
            bedFilter.frequency.value = 120;
            const bedGain = ctx.createGain();
            bedGain.gain.value = 0.5;
            bedSrc.connect(bedFilter).connect(bedGain).connect(dest);
            bedSrc.start(t);
            nodesRef.current.push(bedSrc);

            // --- 2. Reactor Hum (Sub-bass pulse) ---
            const reactOsc = ctx.createOscillator();
            reactOsc.type = 'sawtooth';
            reactOsc.frequency.value = 55;
            const reactFilter = ctx.createBiquadFilter();
            reactFilter.type = 'lowpass';
            reactFilter.frequency.value = 80;
            const reactGain = ctx.createGain();
            reactGain.gain.value = 0.15;

            // LFO for Reactor Pulse
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.5; // Slow pulse
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 20; // Modulate filter freq
            lfo.connect(lfoGain).connect(reactFilter.frequency);

            reactOsc.connect(reactFilter).connect(reactGain).connect(dest);
            reactOsc.start(t);
            lfo.start(t);
            nodesRef.current.push(reactOsc, lfo);

            // --- 3. Life Support (Hiss/Airflow) ---
            const airSrc = ctx.createBufferSource();
            airSrc.buffer = noiseBuffer;
            airSrc.loop = true;
            const airFilter = ctx.createBiquadFilter();
            airFilter.type = 'bandpass';
            airFilter.frequency.value = 800;
            airFilter.Q.value = 1;
            const airGain = ctx.createGain();
            airGain.gain.value = 0.05;

            // Breathing LFO
            const breathLfo = ctx.createOscillator();
            breathLfo.frequency.value = 0.1; // Very slow breath
            const breathGain = ctx.createGain();
            breathGain.gain.value = 0.02;
            breathLfo.connect(breathGain).connect(airGain.gain);

            airSrc.connect(airFilter).connect(airGain).connect(dest);
            airSrc.start(t);
            breathLfo.start(t);
            nodesRef.current.push(airSrc, breathLfo);

            // --- 4. Artificial Gravity (Sub-bass stabilized) ---
            const gravOsc = ctx.createOscillator();
            gravOsc.type = 'sine';
            gravOsc.frequency.value = 32; // Deep sub
            const gravGain = ctx.createGain();
            gravGain.gain.value = 0.3;
            gravOsc.connect(gravGain).connect(dest);
            gravOsc.start(t);
            nodesRef.current.push(gravOsc);

            // --- 5. Console Tones (Random Beeps) ---
            const scheduleBeep = () => {
                if (!contextRef.current) return;
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                const now = ctx.currentTime;

                osc.frequency.value = 2000 + Math.random() * 1000;
                osc.type = 'sine';

                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.02, now + 0.05);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

                osc.connect(g).connect(dest);
                osc.start(now);
                osc.stop(now + 0.3);

                // Re-schedule
                setTimeout(scheduleBeep, 2000 + Math.random() * 5000);
            };
            scheduleBeep();

            // --- 6. Hull Creaks (Metal Groans) ---
            const scheduleCreak = () => {
                if (!contextRef.current) return;
                const creakSrc = ctx.createBufferSource();
                creakSrc.buffer = noiseBuffer;
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 100 + Math.random() * 100;
                filter.Q.value = 5;
                const g = ctx.createGain();
                const now = ctx.currentTime;

                // Long slow attack/decay
                const duration = 1 + Math.random() * 2;
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.05, now + duration * 0.2);
                g.gain.linearRampToValueAtTime(0, now + duration);

                creakSrc.connect(filter).connect(g).connect(dest);
                creakSrc.start(now);
                creakSrc.stop(now + duration + 0.5);

                setTimeout(scheduleCreak, 5000 + Math.random() * 10000);
            };
            scheduleCreak();
        };

        const init = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Ctx = window.AudioContext || (window as any).webkitAudioContext;
            if (!Ctx) return;

            if (!contextRef.current) {
                contextRef.current = new Ctx();
                masterGainRef.current = contextRef.current.createGain();
                masterGainRef.current.gain.value = 0.3;
                masterGainRef.current.connect(contextRef.current.destination);
            }

            if (contextRef.current.state === 'suspended') {
                contextRef.current.resume();
            }

            setupLayers(contextRef.current, masterGainRef.current!);
        };

        const handleInteract = () => {
            init();
            window.removeEventListener('click', handleInteract);
            window.removeEventListener('keydown', handleInteract);
        };

        window.addEventListener('click', handleInteract);
        window.addEventListener('keydown', handleInteract);

        return () => {
            window.removeEventListener('click', handleInteract);
            window.removeEventListener('keydown', handleInteract);
            stopLayers();
            contextRef.current?.close();
            contextRef.current = null;
        };
    }, []);

    return null; // Visual-less component
}
