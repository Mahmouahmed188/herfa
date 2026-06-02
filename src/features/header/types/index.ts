import type { UserRole } from '@/store/useAuthStore';

export interface NavigationItem {
  id: string;
  labelKey: string;
  href: string;
  roles?: UserRole[];
  icon?: string;
  order: number;
  children?: NavigationItem[];
  dividerBefore?: boolean;
}

export interface NavigationConfig {
  items: NavigationItem[];
}

export interface UseNavigationReturn {
  items: NavigationItem[];
  isActive: (href: string) => boolean;
  isAuthenticated: boolean;
}

export type FullScreenRoutePattern = string;
