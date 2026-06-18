import { UserRole } from '@/types/api';

export const FINANCE_PERMISSIONS = {
  VIEW_HISTORY: ['CUSTOMER', 'PROVIDER', 'ADMIN', 'SUPER_ADMIN'] as UserRole[],
  VIEW_EARNINGS: ['PROVIDER', 'ADMIN', 'SUPER_ADMIN'] as UserRole[],
  REQUEST_REFUND: ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN'] as UserRole[],
  MANAGE_REFUNDS: ['ADMIN', 'SUPER_ADMIN'] as UserRole[],
  MANAGE_PAYOUTS: ['ADMIN', 'SUPER_ADMIN'] as UserRole[],
  VIEW_ALL_PAYMENTS: ['ADMIN', 'SUPER_ADMIN'] as UserRole[],
};
