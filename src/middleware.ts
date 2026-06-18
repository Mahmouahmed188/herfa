import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/about',
    '/technicians',
    '/ai-diagnosis',
    '/services',
    '/support',
    '/favicon.ico'
];

const PROTECTED_PREFIXES = ['/admin', '/client', '/technician'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';

    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );

    const isProtectedRoute = PROTECTED_PREFIXES.some(prefix =>
        pathWithoutLocale.startsWith(prefix)
    );

    console.log('Middleware Debug - EMERGENCY FIX:', {
        pathname,
        pathWithoutLocale,
        isPublicRoute,
        isProtectedRoute,
        cookieToken: request.cookies.get('herfa_token')
    });

    // EMERGENCY FIX: Allow all routes to pass through without authentication checks
    console.log('Middleware - EMERGENCY FIX: All routes allowed - no authentication checks');

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/(en|ar)/:path*']
};