'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBanner } from '@/features/notifications/components/AnnouncementBanner';

const FULL_SCREEN_ROUTES: string[] = [];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const strippedPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';

    const isFullScreenRoute = FULL_SCREEN_ROUTES.some(route => strippedPath === route);

    return (
        <div className="flex flex-col min-h-screen">
            {!isFullScreenRoute && <Header />}
            {!isFullScreenRoute && <AnnouncementBanner />}
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            {!isFullScreenRoute && <Footer />}
        </div>
    );
}
