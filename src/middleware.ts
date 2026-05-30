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

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Remove locale prefix for routing logic
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';

    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );

    // If it's an admin route and no session token is present, redirect to login
    // Note: In production, we would check for a secure HTTP-only cookie
    if (pathWithoutLocale.startsWith('/admin') && !isPublicRoute) {
        const token = request.cookies.get('herfa_token');
        if (!token) {
            const url = request.nextUrl.clone();
            const locale = pathname.split('/')[1] || 'ar';
            url.pathname = `/${locale}/login`;
            return NextResponse.redirect(url);
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/(en|ar)/:path*']
};