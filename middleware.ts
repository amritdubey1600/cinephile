import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Protect all routes - fixed matcher patterns
export const config = {
    matcher: [
        '/profile',
        '/bookings/:path*',        // All booking routes
        '/movies/:id/:path+',      // Only movie sub-paths (not /movies/id itself)
        '/',
        '/login',
        '/signup'
    ],
};

export async function middleware(req: NextRequest) {
    // Let getToken automatically detect the correct cookie name
    const token = await getToken({ 
        req, 
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
        // No need to specify cookieName - it will auto-detect authjs cookies
    });

    const { pathname } = req.nextUrl;

    // Define auth pages
    const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup';
    
    // Define protected routes
    const isProtectedRoute = pathname.startsWith('/bookings') || pathname.startsWith('/profile') || isMovieSubPath(pathname);

    // Helper function to check if it's a movie sub-path (not just /movies/id)
    function isMovieSubPath(path: string): boolean {
        const moviePathRegex = /^\/movies\/[^\/]+\/(.+)$/;
        return moviePathRegex.test(path);
    }

    // Add debugging in development
    if (process.env.NODE_ENV === 'development') {
        console.log('Middleware Debug:', {
            pathname,
            hasToken: !!token,
            tokenContent: token ? { sub: token.sub, email: token.email } : null,
            isAuthPage,
            isProtectedRoute,
            cookies: req.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
        });
    }

    // Redirect unauthenticated users trying to access protected routes
    if (!token && isProtectedRoute) {
        const url = new URL('/redirect', req.url);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    if (token && isAuthPage) {
        const url = new URL('/movies', req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}