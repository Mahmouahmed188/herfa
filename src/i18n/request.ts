import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // In next-intl v4, use requestLocale (a promise)
    let locale = await requestLocale;

    // Fallback to default locale if undefined
    if (!locale || !routing.locales.includes(locale as 'en' | 'ar')) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
