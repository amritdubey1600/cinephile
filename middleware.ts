import { NextRequest, NextResponse } from 'next/server';

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

export function middleware(req: NextRequest) {
    // Check for session token - try different possible names
    const token = 
        req.cookies.get('__Secure-next-auth.session-token')?.value ||
        req.cookies.get('next-auth.session-token')?.value ||
        req.cookies.get('authjs.session-token')?.value; // Auth.js v5

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

    // Redirect unauthenticated users trying to access protected routes
    if (!token && isProtectedRoute) {
        const url = new URL('/redirect', req.url);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    if (token && token.length > 0 && isAuthPage) {
        const url = new URL('/movies', req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}