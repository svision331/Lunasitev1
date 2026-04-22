export interface MembershipTier {
    id: string;
    tier: string;
    name: string;
    unlock: string;
    icon: string;
    color: string;
}

export const membershipTiers: MembershipTier[] = [
    {
        id: 'tier-free',
        tier: 'Free',
        name: 'Email List',
        unlock: 'Next show alerts',
        icon: '📧',
        color: 'slate'
    },
    {
        id: 'tier-1',
        tier: '1 Show',
        name: 'Space Invader',
        unlock: '24hr early tickets',
        icon: '🚀',
        color: 'cyan'
    },
    {
        id: 'tier-3',
        tier: '3 Shows',
        name: 'Nebula Insider',
        unlock: 'Secret coordinates + birthday drops',
        icon: '🌌',
        color: 'purple'
    },
    {
        id: 'tier-super',
        tier: 'Superfan',
        name: 'Ice Giant Council',
        unlock: 'Merch design votes + backstage lottery',
        icon: '❄️',
        color: 'pink'
    }
];

export interface LoreChapter {
    id: string;
    title: string;
    year: string;
    content: string;
    image?: string;
}

export const loreChapters: LoreChapter[] = [
    {
        id: 'chapter-1',
        title: 'A signal is sent.',
        year: '2016',
        content: 'Under the name L.U.N.A., the first transmissions are recorded. Raw, curious, and full of intention, in a Brooklyn apartment, Space Jams EP is created and brought to life, marking the beginning of a sound that blends sensuality, storytelling, and sonic exploration. The voice, velvet layered over voltage, takes shape here.'
    },
    {
        id: 'chapter-2',
        title: 'The world gets a glimpse.',
        year: '2018–2020',
        content: 'Performing Space Jams EP across intimate stages, L.U.N.A. begins translating sound into experience that is live, felt, and otherworldly. The first visuals are captured during this time, marking the start of a visual language to match the music.\n\nAs the performances grow, so does the vision. The foundation for artist-driven spaces begins to take shape.\n\nIn stillness, the signal sharpens. During 2020, L.U.N.A. refines her sound and story, turning inward as the mythology deepens. What began as exploration starts becoming something intentional and unmistakable.\n\nL.U.N.A. evolves.\nLUNATHELOVEGOD emerges.'
    },
    {
        id: 'chapter-3',
        title: 'Transmission strengthens.',
        year: '2021',
        content: 'This marks the emergence of LUNATHELOVEGOD as she is known today. New releases like TLC arrive with precision and purpose, refining the sound and expanding the universe around it. The aesthetic of space, sensuality, power is felt across both music and visuals.\n\nThe first Nebula Bash takes place, introducing an artist-forward, community-centered experience that reflects the world she’s building in real time.'
    },
    {
        id: 'chapter-4',
        title: 'The universe expands.',
        year: '2022–2023',
        content: 'LUNATHELOVEGOD evolves beyond artist into atmosphere, where sound, visuals, and energy move as one. Work begins on the second installment, Nimbus EP, as a new sonic language takes shape: “disco trap,” a fusion of rhythm, the nostalgia of Atlanta’s trap scene, and a disco edge.\n\nThe portal opens in real time. Live experiences deepen, becoming immersive and intentional, no longer just performances, but spaces to step into. The audience doesn’t just watch, they enter into the portal and immerse themselves in the experience.'
    },
    {
        id: 'chapter-5',
        title: 'New frequencies emerge.',
        year: '2025',
        content: 'Homegrown Sessions is launched, creating space for artists and community to connect through live, intimate performance. At the same time, work begins on an untitled EP, with a deeper focus on refining the sound while adding layers of soul and funk.'
    },
    {
        id: 'chapter-6',
        title: 'Now.',
        year: '2026',
        content: 'The universe is fully formed and in motion. Nimbus EP and the untitled project are released, marking a new chapter in sound and vision. What’s been built across years in both music and world building exists in real time.\n\nAnd you’ve just stepped into it.'
    }
];

export const communityStats = {
    spaceInvaders: 1247,
    showsSoldOut: 23,
    averageSelloutTime: '4 hours',
    citiesReached: 8
};
