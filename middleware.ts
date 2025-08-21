import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
    matcher: [
        '/profile',
        '/bookings/:path*',
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

    // Enhanced debugging for production
    const debugInfo = {
        pathname,
        hasToken: !!token,
        tokenContent: token ? { sub: token.sub, email: token?.email } : null,
        isAuthPage,
        isProtectedRoute,
        environment: process.env.NODE_ENV,
        cookies: req.cookies.getAll().map(c => ({ 
            name: c.name, 
            hasValue: !!c.value,
            isSecure: c.name.startsWith('__Secure-'),
            isAuthRelated: c.name.includes('auth')
        })),
        userAgent: req.headers.get('user-agent')?.substring(0, 50)
    };

    // Always log in production to help debug
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
        console.log('Middleware Debug:', JSON.stringify(debugInfo, null, 2));
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

    console.log('Request proceeding normally');
    return NextResponse.next();
}