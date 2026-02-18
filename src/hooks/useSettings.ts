import { useState, useEffect } from 'react';

interface Settings {
    reducedMotion: boolean;
    soundEnabled: boolean;
}

export function useSettings() {
    // Lazy initialization to avoid synchronous state updates in effects
    const [settings, setSettings] = useState<Settings>(() => {
        if (typeof window === 'undefined') {
            return { reducedMotion: false, soundEnabled: true };
        }

        try {
            const stored = localStorage.getItem('luna_settings');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error("Failed to parse settings", e);
        }

        // Fallback to system preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        return { reducedMotion: mediaQuery.matches, soundEnabled: true };
    });

    const toggleReducedMotion = () => {
        setSettings(prev => {
            const next = { ...prev, reducedMotion: !prev.reducedMotion };
            localStorage.setItem('luna_settings', JSON.stringify(next));
            return next;
        });
    };

    const toggleSound = () => {
        setSettings(prev => {
            const next = { ...prev, soundEnabled: !prev.soundEnabled };
            localStorage.setItem('luna_settings', JSON.stringify(next));
            return next;
        });
    };

    return {
        settings,
        toggleReducedMotion,
        toggleSound
    };
}
