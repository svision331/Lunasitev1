import { NextRequest, NextResponse } from 'next/server';
import { getWaitlist, saveWaitlist } from '@/lib/storage';

export async function POST(req: NextRequest) {
    try {
        const { email, instagram } = await req.json();

        // Basic validation
        if (!email || typeof email !== 'string' || email.length > 254) {
            return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
        }
        if (!instagram || typeof instagram !== 'string' || instagram.length > 30) {
            return NextResponse.json({ error: 'Valid Instagram handle is required.' }, { status: 400 });
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
        waitlist.push({ 
            email: normalizedEmail, 
            instagram: instagram.trim(),
            signedUpAt: new Date().toISOString() 
        });
        await saveWaitlist(waitlist);

        return NextResponse.json({ success: true, message: 'You have been added to the waitlist.' });
    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}


