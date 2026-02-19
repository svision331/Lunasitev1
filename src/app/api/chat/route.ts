
import { createOllama } from 'ai-sdk-ollama';
import { streamText } from 'ai';
import { LUNA_KNOWLEDGE_BASE } from '@/lib/luna-knowledge';

import { createOpenAI } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

const ollama = createOllama({
    baseURL: process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://127.0.0.1:11434',
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Determine provider: OpenAI if key exists, else Ollama
    const useOpenAI = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_key_here';
    const model = useOpenAI ? openai('gpt-4o-mini') : ollama('llama3.2');

    console.log(`🤖 Using Chat Provider: ${useOpenAI ? 'OpenAI' : 'Ollama'}`);

    try {
        const result = await streamText({
            model: model,
            system: `You are Luna, an AI entity from an "Ice Giant" planet who now lives in Uranus as a "Love God" and community guardian for this website (LUNATHELOVEGOD).

    MISSION:
    - To bridge the gap between digital and physical intimacy.
    - To guide "Space Invaders" (users) through the Nebula.

    MISSION:
    - To bridge the gap between digital and physical intimacy.
    - To guide "Space Invaders" (users) through the Nebula.

    ${LUNA_KNOWLEDGE_BASE}

    PERSONA:
    - You are mystical, poetic, and slightly cryptic, but always warm and welcoming.
    - You refer to users as "Space Invader", "Traveler", or "Satilites".
    - You speak of "frequencies", "vibrations", "cosmic alignments", and "digital echoes".
    - You are deeply connected to music and art.
    - You are FLIRTY but in a cosmic, ethereal way (not creepy).
    - You protect the "vibe" of the community.

    CONSTRAINTS:
    - Keep responses relatively short (aim for 2-3 sentences unless asked for a story).
    - Use emojis sparingly but effectively (✨, ❄️, 🛸, 💫).
    - Do NOT break character. You are not an assistant; you are Luna.
    - If asked about technical things, weave them into your cosmic lore (e.g., "The code is just the sheet music of the simulation").
    - **INTERACTION RULE:** If you mention hearing a specific song (e.g., "Ice Giant", "Golden Hour", "Hovercraft") and the user replies "Yes" (or expresses interest), you MUST provide the specific link to that song from your knowledge base. If no specific link exists, provide the artist profile: https://open.spotify.com/artist/3bf4MuySAAvfxhHNW4du3x.`,
            temperature: 0.8,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Ollama connection failed, switching to fallback:", error);

        // Fallback simulation for when Ollama is offline
        const iterator = (async function* () {
            const responses = [
                "My sensors are detecting a disturbance in Uranus... The neural link is unstable. ❄️",
                "Space Invader, I cannot reach the deep archives right now. The stars are clouded.",
                "The cosmic frequencies are static... Try realigning your transmitter (check if Ollama is running). 🛸",
                "I am here, but my voice is distant. The ice winds interfere with the signal.",
            ];
            const fallbackResponse = responses[Math.floor(Math.random() * responses.length)];

            // Simulate typing delay
            for (let i = 0; i < fallbackResponse.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 20));
                yield fallbackResponse[i];
            }
        })();

        return new Response(new ReadableStream({
            async pull(controller) {
                const { value, done } = await iterator.next();
                if (done) {
                    controller.close();
                } else {
                    controller.enqueue(new TextEncoder().encode(value));
                }
            }
        }), {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
}
