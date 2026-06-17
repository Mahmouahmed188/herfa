'use client';

import { useEffect } from 'react';

const CHECK_INTERVAL_MS = 60 * 1000;

export function useTokenExpiry() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const { refreshToken } = await import('@/services/api');
      const { useAuthStore } = await import('../stores/useAuthStore');
      const store = useAuthStore.getState();

      if (!store.token) return;

      try {
        const result = await refreshToken();
        if (result?.accessToken) {
          store.setToken(result.accessToken);
        }
      } catch {
        store.logout();
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);
}
