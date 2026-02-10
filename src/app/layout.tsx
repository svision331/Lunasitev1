import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { CosmicCursor, CustomCursor } from '@/components/effects';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'LUNATHELOVEGOD | Ice Giant Lover Girl',
  description: 'Official website of LUNATHELOVEGOD. Listen to the latest tracks, see live show dates, and join the Space Invaders community.',
  keywords: ['LUNATHELOVEGOD', 'Ice Giant Lover Girl', 'Music', 'Artist', 'NYC', 'Nebula Bash'],
  openGraph: {
    title: 'LUNATHELOVEGOD | Ice Giant Lover Girl',
    description: 'Ice Giant Lover Girl — Live from NYC. Join the Space Invaders.',
    type: 'website',
    locale: 'en_US',
    siteName: 'LUNATHELOVEGOD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUNATHELOVEGOD',
    description: 'Ice Giant Lover Girl — Live from NYC',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // suppressHydrationWarning is added to the html tag because browser extensions
  // (like Jetski or translation tools) often inject attributes that cause
  // hydration mismatches in Next.js.
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased selection:bg-cyan-500/30 selection:text-cyan-200`} suppressHydrationWarning>
        {/* Global Cursor Effect */}
        <CosmicCursor />

        {/* Custom Ice Heart Cursor */}
        <CustomCursor />

        {/* Noise texture overlay */}
        <div className="noise-overlay" />
        {children}
      </body>
    </html >
  );
}
