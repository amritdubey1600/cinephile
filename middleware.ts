import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
    matcher: [
        '/profile',
        '/bookings',
        '/movies/:id/:path+',
        '/',
        '/login',
        '/signup'
    ],
};

export async function middleware(req: NextRequest) {
    let token = null;
    let authMethod = 'none';
    
    try {
        if (process.env.NODE_ENV === 'production') {
            // Production: Try with explicit secure cookie name first
            token = await getToken({ 
                req, 
                secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
                cookieName: '__Secure-authjs.session-token'
            });
            authMethod = token ? 'secure-cookie' : authMethod;
            
            // If that fails, try without specifying cookie name
            if (!token) {
                token = await getToken({ 
                    req, 
                    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
                });
                authMethod = token ? 'auto-detect' : authMethod;
            }
        } else {
            // Development: Use auto-detection
            token = await getToken({ 
                req, 
                secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
            });
            authMethod = token ? 'dev-auto' : authMethod;
        }
    } catch (error) {
        console.error('Token parsing error:', error);
        authMethod = 'error-fallback';
    }

    // Enhanced fallback for credentials provider
    if (!token) {
        // Check for any session-related cookies
        const sessionCookies = [
            '__Secure-authjs.session-token',
            'authjs.session-token',
            '__Secure-next-auth.session-token',
            'next-auth.session-token'
        ];
        
        const foundCookie = sessionCookies.find(cookieName => 
            req.cookies.get(cookieName)?.value
        );
        
        if (foundCookie) {
            const cookieValue = req.cookies.get(foundCookie)?.value;
            if (cookieValue && cookieValue.length > 10) { // Basic validation
                token = { sub: 'cookie-fallback', provider: 'unknown' };
                authMethod = `cookie-fallback-${foundCookie}`;
            }
        }
    }

    const { pathname } = req.nextUrl;
    const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup';
    const isProtectedRoute = pathname.startsWith('/bookings') || pathname.startsWith('/profile') || isMovieSubPath(pathname);

    function isMovieSubPath(path: string): boolean {
        const moviePathRegex = /^\/movies\/[^\/]+\/(.+)$/;
        return moviePathRegex.test(path);
    }

    // Comprehensive debugging
    const debugInfo = {
        pathname,
        hasToken: !!token,
        authMethod,
        tokenInfo: token ? {
            sub: token.sub,
            email: token.email,
            provider: token.provider,
            iat: token.iat,
            exp: token.exp
        } : null,
        isAuthPage,
        isProtectedRoute,
        environment: process.env.NODE_ENV,
        cookies: req.cookies.getAll()
            .filter(c => c.name.includes('auth') || c.name.includes('session'))
            .map(c => ({ 
                name: c.name, 
                hasValue: !!c.value,
                valueLength: c.value?.length || 0,
                isSecure: c.name.startsWith('__Secure-'),
                isHost: c.name.startsWith('__Host-')
            })),
        userAgent: req.headers.get('user-agent')?.includes('Chrome') ? 'Chrome' : 'Other',
        timestamp: new Date().toISOString()
    };
    
    // Log for both production and development when dealing with auth
    if (isProtectedRoute || isAuthPage || !token) {
        console.log('🔐 Auth Middleware Debug:', JSON.stringify(debugInfo, null, 2));
    }

    // Block unauthenticated access to protected routes
    if (!token && isProtectedRoute) {
        console.log(`🚫 BLOCKING: ${pathname} - No valid authentication found`);
        console.log('Available cookies:', req.cookies.getAll().map(c => c.name));
        return NextResponse.redirect(new URL('/redirect', req.url));
    }

    // Redirect authenticated users away from auth pages
    if (token && isAuthPage) {
        console.log(`✅ REDIRECTING: ${pathname} → /movies - User authenticated via ${authMethod}`);
        return NextResponse.redirect(new URL('/movies', req.url));
    }

    if (token && isProtectedRoute) {
        console.log(`✅ ALLOWING: ${pathname} - User authenticated via ${authMethod}`);
    }

    return NextResponse.next();
}