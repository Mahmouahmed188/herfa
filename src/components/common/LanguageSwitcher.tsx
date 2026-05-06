'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: 'en' | 'ar') => {
        localStorage.setItem('NEXT_LOCALE', newLocale);
        // Also set cookie to help middleware (next-intl does this partly, but let's be explicit if needed)
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        router.push(pathname as any, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-1 rounded-lg border border-surface-border bg-surface-dark p-1">
            <button
                type="button"
                onClick={() => switchLocale('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors
          ${locale === 'en'
                        ? 'bg-primary text-background-dark'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                EN
            </button>

            <button
                type="button"
                onClick={() => switchLocale('ar')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors
          ${locale === 'ar'
                        ? 'bg-primary text-background-dark'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                AR
            </button>
        </div>
    );
}
