'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { navigationConfig } from '../config/navigation';
import type { NavigationItem, UseNavigationReturn } from '../types';

export function useNavigation(pathname: string): UseNavigationReturn {
  const { user, isAuthenticated } = useAuthStore();

  const role = user?.role ?? null;

  const items = useMemo<NavigationItem[]>(() => {
    const allItems = navigationConfig.items;

    if (!isAuthenticated || !role) {
      return allItems
        .filter((item) => !item.roles)
        .sort((a, b) => a.order - b.order);
    }

    return allItems
      .filter((item) => {
        if (!item.roles) return false;
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
