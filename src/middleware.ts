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

    console.log('Middleware Debug:', {
        pathname,
        pathWithoutLocale,
        isPublicRoute,
        isProtectedRoute,
        cookieToken: request.cookies.get('herfa_token')
    });

    if (isProtectedRoute && !isPublicRoute) {
        const token = request.cookies.get('herfa_token');
        if (!token) {
            console.log('Middleware - No token found, redirecting to login');
            const url = request.nextUrl.clone();
            const locale = pathname.split('/')[1] || 'ar';
            url.pathname = `/${locale}/login`;
            return NextResponse.redirect(url);
        } else {
            console.log('Middleware - Token found, allowing access');
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/(en|ar)/:path*']
};