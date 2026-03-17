import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'LUNATHELOVEGOD',
        short_name: 'LUNA',
        description: 'Enter The Void. LUNATHELOVEGOD — Ice Giant Lover Girl. Tune your frequencies and join the Space Invaders.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
