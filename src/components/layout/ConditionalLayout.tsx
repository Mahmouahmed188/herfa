'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const AUTH_ROUTES = ['/login', '/register'];
const NO_CHROME_ROUTES = ['/client', '/technician', '/admin', '/support'];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // strip the locale prefix (e.g. /en/login -> /login)
    const strippedPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    const isAuthRoute = AUTH_ROUTES.some(route => strippedPath.startsWith(route));
    const isDashboardRoute = NO_CHROME_ROUTES.some(route => strippedPath.startsWith(route));

    if (isAuthRoute || isDashboardRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
