import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'ar'],

    // Used when no locale matches
    defaultLocale: 'en',

    localePrefix: 'always',

    // Define pathnames that should be translated
    pathnames: {
        '/': '/',
        '/about': '/about',
        '/technicians': '/technicians',
        '/ai-diagnosis': '/ai-diagnosis',
        '/services': '/services',
        '/login': '/login',
        '/register': '/register',
        '/client/dashboard': '/client/dashboard',
        '/technician/dashboard': '/technician/dashboard',
        '/admin/dashboard': '/admin/dashboard',
    }
});
