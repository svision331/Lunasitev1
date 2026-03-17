'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface Settings {
    reducedMotion: boolean;
}

interface SettingsContextType {
    settings: Settings;
    toggleReducedMotion: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings>(() => {
        // Default values
        return { reducedMotion: false };
    });

    // Initialize from localStorage on mount (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('luna_settings');
                let newSettings = null;
                if (stored) {
                    newSettings = JSON.parse(stored);
                } else {
                    // Fallback to system preference
                    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
                    newSettings = { reducedMotion: mediaQuery.matches };
                }
                setTimeout(() => {
                    setSettings(prev => ({ ...prev, ...newSettings }));
                }, 0);
            } catch (e) {
                console.warn('Failed to parse settings', e);
            }
        }
    }, []);

    const toggleReducedMotion = useCallback(() => {
        setSettings(prev => {
            const next = { ...prev, reducedMotion: !prev.reducedMotion };
            localStorage.setItem('luna_settings', JSON.stringify(next));
            return next;
        });
    }, []);

    return (
        <SettingsContext.Provider value={{
            settings,
            toggleReducedMotion
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
