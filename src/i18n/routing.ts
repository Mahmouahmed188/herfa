import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'ar'],

    // Used when no locale matches
    defaultLocale: 'ar',

    localePrefix: 'always',

    // Define pathnames that should be translated
    pathnames: {
        '/': '/',
        '/about': '/about',
        '/technicians': '/technicians',
        '/technicians/[id]': '/technicians/[id]',
        '/ai-diagnosis': '/ai-diagnosis',
        '/services': '/services',
        '/login': '/login',
        '/register': '/register',
        '/client/dashboard': '/client/dashboard',
        '/client/create-job': '/client/create-job',
        '/client/jobs': '/client/jobs',
        '/client/jobs/[id]': '/client/jobs/[id]',
        '/client/wallet': '/client/wallet',
        '/client/saved': '/client/saved',
        '/client/profile': '/client/profile',
        '/client/settings': '/client/settings',
        '/technician/dashboard': '/technician/dashboard',
        '/technician/requests': '/technician/requests',
        '/technician/earnings': '/technician/earnings',
        '/technician/profile': '/technician/profile',
        '/admin/dashboard': '/admin/dashboard',
        '/admin/users': '/admin/users',
        '/admin/jobs': '/admin/jobs',
        '/admin/settings': '/admin/settings',
        '/support': '/support',
    }
});
