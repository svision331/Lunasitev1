import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const basicAuth = req.headers.get('authorization');
        
        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            const [user, pwd] = atob(authValue).split(':');

            // Set simple credentials here
            if (user === 'luna' && pwd === 'lovegod') {
                return NextResponse.next();
            }
        }

        return new NextResponse('Authentication Required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Admin Control Panel"',
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
