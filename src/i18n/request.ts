import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
    // Log for debugging
    console.log('getRequestConfig locale:', locale);

    const activeLocale = locale || routing.defaultLocale;

    return {
        locale: activeLocale,
        messages: (await import(`../messages/${activeLocale}.json`)).default
    };
});
