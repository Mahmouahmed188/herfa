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
        // 1. Get saved language from localStorage
        const storedLocale = localStorage.getItem('NEXT_LOCALE');

        // 2. Determine target locale
        // If nothing in localStorage, default to 'ar' (requirement 5)
        const targetLocale = storedLocale || 'ar';

        // 3. Save if it was empty (requirement 5)
        if (!storedLocale) {
            localStorage.setItem('NEXT_LOCALE', 'ar');
        }

        // 4. Redirect if current route locale doesn't match stored preference (requirement 4)
        if (targetLocale !== locale) {
            // Use router.replace to avoid cluttering history with redirects
            router.replace(pathname, { locale: targetLocale as 'en' | 'ar' });
        }
    }, [locale, pathname, router]);

    return null;
}
