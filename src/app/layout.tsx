import type { Metadata } from 'next';
import { Share_Tech_Mono, Fira_Code } from 'next/font/google';
import './globals.css';
import { SoundProvider } from '@/context/SoundContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { CustomCursor } from '@/components/effects/CustomCursor';

const shareTechMono = Share_Tech_Mono({ weight: '400', subsets: ['latin'], variable: '--font-share-tech' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' });

export const viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'LUNATHELOVEGOD | Enter The Void',
  description: 'Enter The Void. LUNATHELOVEGOD — Ice Giant Lover Girl. Tune your frequencies and join the Space Invaders.',
  keywords: ['LUNATHELOVEGOD', 'Ice Giant Lover Girl', 'Music', 'Artist', 'NYC', 'Nebula Bash', 'Space Invaders'],
  openGraph: {
    title: 'LUNATHELOVEGOD | Enter The Void',
    description: 'Enter The Void. LUNATHELOVEGOD — Ice Giant Lover Girl. Tune your frequencies and join the Space Invaders.',
    type: 'website',
    locale: 'en_US',
    siteName: 'LUNATHELOVEGOD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUNATHELOVEGOD',
    description: 'Enter The Void. LUNATHELOVEGOD — Ice Giant Lover Girl. Tune your frequencies and join the Space Invaders.',
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
      <body className={`${shareTechMono.variable} ${firaCode.variable} antialiased selection:bg-cyan-500/30 selection:text-cyan-200`} suppressHydrationWarning>
        <SettingsProvider>
          <SoundProvider>
            {/* Global Background Effects */}
            <CustomCursor />

            {/* Noise texture overlay */}
            <div className="noise-overlay" />
            {children}
          </SoundProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
