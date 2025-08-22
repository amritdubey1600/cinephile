import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
    matcher: [
        '/profile',
        '/movies/:id/:path+',
        '/',
        '/login',
        '/signup'
    ],
};

export async function middleware(req: NextRequest) {
    let token = null;
    
    try {
        // Try multiple approaches for different environments
        if (process.env.NODE_ENV === 'production') {
            // Production: Try with explicit secure cookie name
            token = await getToken({ 
                req, 
                secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
                cookieName: '__Secure-authjs.session-token'
            });
            
            // If that fails, try without specifying cookie name
            if (!token) {
                token = await getToken({ 
                    req, 
                    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
                });
            }
        } else {
            // Development: Use auto-detection
            token = await getToken({ 
                req, 
                secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
            });
        }
    } catch (error) {
        console.error('Token parsing error:', error);
        // Fallback: manually check for session token in cookies
        const sessionCookie = req.cookies.get('__Secure-authjs.session-token')?.value || 
                             req.cookies.get('authjs.session-token')?.value;
        // If we have a session cookie, assume user is authenticated
        token = sessionCookie ? { sub: 'fallback' } : null;
    }

    const { pathname } = req.nextUrl;

    const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup';
    const isProtectedRoute = pathname.startsWith('/bookings') || pathname.startsWith('/profile') || isMovieSubPath(pathname);

    function isMovieSubPath(path: string): boolean {
        const moviePathRegex = /^\/movies\/[^\/]+\/(.+)$/;
        return moviePathRegex.test(path);
    }

    // Redirect unauthenticated users trying to access protected routes
    if (!token && isProtectedRoute) {
        console.log('Redirecting to /redirect - no valid token');
        const url = new URL('/redirect', req.url);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    if (token && isAuthPage) {
        console.log('Redirecting to /movies - user authenticated');
        const url = new URL('/movies', req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}