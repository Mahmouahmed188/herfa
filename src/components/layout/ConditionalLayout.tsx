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

    // We can define which routes should NOT show Navbar/Footer, 
    // but to avoid re-mounting, we can handle this with a wrapper or just show them if the user wants them "across ALL pages".
    // For now, let's follow the requirement "across ALL pages" but allow hiding on auth if it feels better.
    // Actually, to truly "persist and not re-mount", they should be always in the tree.

    const NO_CHROME_PREFIXES = ['/login', '/register', '/client', '/technician', '/admin'];
    const isNoChromeRoute = NO_CHROME_PREFIXES.some(prefix => strippedPath.startsWith(prefix));

    return (
        <div className="flex flex-col min-h-screen">
            {!isNoChromeRoute && <Navbar />}
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            {!isNoChromeRoute && <Footer />}
        </div>
    );
}
