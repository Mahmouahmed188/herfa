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
    '/support'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const match = pathname.match(/^\/(en|ar)((?:\/.*)?)$/);
    const path = match ? (match[1] || '/') : '/';

    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        path === route || path.startsWith(route + '/')
    );

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/(en|ar)/:path*']
};