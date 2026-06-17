import { UserRole } from '@/types/api';

export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'CUSTOMER':
      return '/client/dashboard';
    case 'PROVIDER':
      return '/technician/dashboard';
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return '/admin/dashboard';
    default:
      return '/login';
  }
}
