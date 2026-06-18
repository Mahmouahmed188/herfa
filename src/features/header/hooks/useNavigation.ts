'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { navigationConfig } from '../config/navigation';
import type { NavigationItem, UseNavigationReturn } from '../types';

export function useNavigation(pathname: string): UseNavigationReturn {
  const { user, isAuthenticated } = useAuthStore();

  const role = user?.role ?? null;

  const items = useMemo<NavigationItem[]>(() => {
    const allItems = navigationConfig.items;

    // If not authenticated or no role, show only public items (no roles required)
    if (!isAuthenticated || !role) {
      return allItems
        .filter((item) => !item.roles || (item.roles.length === 0))
        .sort((a, b) => a.order - b.order);
    }

    // If authenticated with role, show items that include this role
    return allItems
      .filter((item) => {
        // Items without roles are shown to everyone (public items)
        if (!item.roles || item.roles.length === 0) return true;
        
        // Items with roles are shown only if user has one of those roles
        return item.roles.includes(role);
      })
      .sort((a, b) => a.order - b.order);
  }, [isAuthenticated, role]);

  const isActive = useMemo<(href: string) => boolean>(() => {
    return (href: string) => {
      const strippedPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';
      if (href === '/') return strippedPath === '/';
      return strippedPath.startsWith(href);
    };
  }, [pathname]);

  return { items, isActive, isAuthenticated };
}
