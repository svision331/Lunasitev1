# LUNA THE LOVE GOD - Nebula OS v4.5

Welcome to the digital realm of LUNA THE LOVE GOD. This project is the central hub for the "Space Invaders" community, featuring music, live show dates, and a unique "Nebula Console" interface.

## 🌌 Project Overview

This website serves as an immersive "Operating System" for fans, allowing them to:

- **Command the Console**: A gamified dashboard (`NebulaConsole`) to navigate the universe.
- **Listen to Music**: Integrated Spotify player ("Sonic Array") with holographic visualizers.
- **Explore the Cosmos**: Interactive star system map (`CosmosMap`) for lore and content.
- **Join the Mission**: "Mission Log" for community tasks and rewards.
- **Connect**: AI-powered "Comms Interface" to chat with LUNA.

## 🛠 Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, CSS Variables (Oklch gamut)
- **Animation**: Framer Motion v12
- **Icons**: Lucide React
- **AI**: Vercel AI SDK (OpenAI gpt-4o)

## 📂 Project Architecture

```
src/
├── app/                 # App Router (Pages & Layouts)
│   ├── layout.tsx       # Root layout (Fonts, Cursors, Global CSS)
│   ├── page.tsx         # Root page (Nebula Console)
│   ├── globals.css      # Design Tokens & Global Styles (Oklch Colors)
│   └── bridge/          # Bridge Interface Routes
├── components/
│   ├── ui/              # Reusable UI Primitives (CyberButton, HoloCard, TechBorder)
│   ├── landing/         # Landing Page Modules (NebulaConsole, Hero)
│   ├── bridge/          # Bridge Specifics (MusicPlayer, CosmosMap, StatCard)
│   └── effects/         # Visual Effects (Starfield, GridBackground)
└── lib/                 # Utilities and Constants
```

## 🎨 Design System (Cosmic Editorial)

defined in `src/app/globals.css`

### Typography

- **Headers**: `Syncopate` (Futuristic, Wide)
- **Data/Code**: `Space Mono` (Terminal, Legible)
- **Body**: `Space Mono`

### Color Palette (Oklch High-Vibe)

- **Primary (Cyan)**: `oklch(0.7 0.18 220)` - Electric energy
- **Secondary (Pink)**: `oklch(0.65 0.22 320)` - Neon accents
- **Background**: Deep Void Black (`#020205`) with stardust overlays

### Visual Effects

- **Glassmorphism**: `.glass-card` with iridescent borders and blur.
- **Glows**: "Radioactive" variants for buttons and active states.
- **Motion**: Fluid warp-speed transitions and snap-physics hover states.

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

## 🔑 Environment Variables

To enable the AI chat ("Comms Interface"), add the following to your `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

---
*Transmission Ended* 🛸
