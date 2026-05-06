'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';

/**
 * Handles language persistence and initial redirection based on localStorage.
 * This component should be rendered in the RootLayout but only runs on the client.
 */
export default function LocalePersistence() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const authRoutes = ['/login', '/register'];
        const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
        if (isAuthRoute) return;

        const storedLocale = localStorage.getItem('NEXT_LOCALE');
        const targetLocale = storedLocale || 'ar';

        if (!storedLocale) {
            localStorage.setItem('NEXT_LOCALE', 'ar');
        }

        if (targetLocale !== locale) {
            router.replace(pathname as any, { locale: targetLocale as 'en' | 'ar' });
        }
    }, [locale, pathname, router]);

    return null;
}
