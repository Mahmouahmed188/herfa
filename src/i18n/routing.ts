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
        '/services/[id]': '/services/[id]',
        '/tenders/create': '/tenders/create',
        '/tenders/[id]': '/tenders/[id]',
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
        '/client/notifications': '/client/notifications',
        '/client/addresses': '/client/addresses',
        '/technician/dashboard': '/technician/dashboard',
        '/technician/onboarding-home': '/technician/onboarding-home',
        '/technician/requests': '/technician/requests',
        '/technician/earnings': '/technician/earnings',
        '/technician/profile': '/technician/profile',
        '/admin/dashboard': '/admin/dashboard',
        '/admin/users': '/admin/users',
        '/admin/providers': '/admin/providers',
        '/admin/providers/[id]': '/admin/providers/[id]',
        '/admin/providers/verification': '/admin/providers/verification',
        '/admin/providers/verification/[id]': '/admin/providers/verification/[id]',
        '/admin/users/[id]': '/admin/users/[id]',
        '/admin/bookings': '/admin/bookings',
        '/admin/finance': '/admin/finance',
        '/admin/cms': '/admin/cms',
        '/admin/notifications': '/admin/notifications',
        '/admin/analytics': '/admin/analytics',
        '/admin/audit': '/admin/audit',
        '/admin/settings': '/admin/settings',
        '/support': '/support',
    }
});
