import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const WAITLIST_PATH = path.join(process.cwd(), 'src/data/waitlist.json');

interface WaitlistEntry {
    email: string;
    signedUpAt: string;
}

async function getWaitlist(): Promise<WaitlistEntry[]> {
    try {
        const data = await fs.readFile(WAITLIST_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveWaitlist(entries: WaitlistEntry[]): Promise<void> {
    await fs.writeFile(WAITLIST_PATH, JSON.stringify(entries, null, 2));
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        // Basic validation
        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const waitlist = await getWaitlist();

        // Check for duplicates
        if (waitlist.some(e => e.email === normalizedEmail)) {
            return NextResponse.json({ error: 'This email is already on the list.' }, { status: 409 });
        }

        // Add new entry
        waitlist.push({ email: normalizedEmail, signedUpAt: new Date().toISOString() });
        await saveWaitlist(waitlist);

        return NextResponse.json({ success: true, message: 'You have been added to the waitlist.' });
    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

export async function GET() {
    // Admin endpoint to view all waitlist entries
    try {
        const waitlist = await getWaitlist();
        return NextResponse.json({ count: waitlist.length, entries: waitlist });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch waitlist.' }, { status: 500 });
    }
}
