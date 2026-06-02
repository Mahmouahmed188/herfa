import type { NavigationConfig, NavigationItem } from '../types';

const guestItems: NavigationItem[] = [
  { id: 'services', labelKey: 'Navbar.services', href: '/services', order: 10 },
  { id: 'aiDiagnosis', labelKey: 'Navbar.aiDiagnosis', href: '/ai-diagnosis', order: 20 },
  { id: 'technicians', labelKey: 'Navbar.technicians', href: '/technicians', order: 30 },
  { id: 'about', labelKey: 'Navbar.about', href: '/about', order: 40 },
];

const clientItems: NavigationItem[] = [
  { id: 'myBookings', labelKey: 'Header.nav.myBookings', href: '/client/my-bookings', roles: ['client'], order: 10 },
  { id: 'dashboard', labelKey: 'Header.nav.dashboard', href: '/client/dashboard', roles: ['client'], order: 20 },
  { id: 'profile', labelKey: 'Header.nav.profile', href: '/client/profile', roles: ['client'], order: 30 },
];

const technicianItems: NavigationItem[] = [
  { id: 'myJobs', labelKey: 'Header.nav.myJobs', href: '/technician/my-jobs', roles: ['technician'], order: 10 },
  { id: 'earnings', labelKey: 'Header.nav.earnings', href: '/technician/earnings', roles: ['technician'], order: 20 },
  { id: 'schedule', labelKey: 'Header.nav.schedule', href: '/technician/schedule', roles: ['technician'], order: 30 },
  { id: 'dashboard', labelKey: 'Header.nav.dashboard', href: '/technician/dashboard', roles: ['technician'], order: 40 },
];

const adminItems: NavigationItem[] = [
  { id: 'adminDashboard', labelKey: 'Header.nav.adminDashboard', href: '/admin/dashboard', roles: ['admin'], icon: 'LayoutDashboard', order: 10 },
  { id: 'users', labelKey: 'Header.nav.users', href: '/admin/users', roles: ['admin'], icon: 'Users', order: 20 },
  { id: 'providers', labelKey: 'Header.nav.providers', href: '/admin/providers', roles: ['admin'], icon: 'ShieldCheck', order: 30 },
  { id: 'bookings', labelKey: 'Header.nav.bookings', href: '/admin/bookings', roles: ['admin'], icon: 'Briefcase', order: 40 },
  { id: 'finance', labelKey: 'Header.nav.finance', href: '/admin/finance', roles: ['admin'], icon: 'Wallet', order: 50 },
  { id: 'analytics', labelKey: 'Header.nav.analytics', href: '/admin/analytics', roles: ['admin'], icon: 'BarChart3', order: 60 },
  { id: 'cms', labelKey: 'Header.nav.cms', href: '/admin/cms', roles: ['admin'], icon: 'FileText', order: 70 },
  { id: 'notifications', labelKey: 'Header.nav.notifications', href: '/admin/notifications', roles: ['admin'], icon: 'Bell', order: 80 },
  { id: 'audit', labelKey: 'Header.nav.audit', href: '/admin/audit', roles: ['admin'], icon: 'Activity', order: 90 },
  { id: 'settings', labelKey: 'Header.nav.settings', href: '/admin/settings', roles: ['admin'], icon: 'Settings', order: 100 },
];

const publicItems: NavigationItem[] = [
  ...guestItems,
];

const authenticatedItems: NavigationItem[] = [
  ...clientItems,
  ...technicianItems,
];

const allItems: NavigationItem[] = [
  ...publicItems,
  ...authenticatedItems,
  ...adminItems,
];

export const navigationConfig: NavigationConfig = {
  items: allItems,
};
