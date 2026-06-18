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
      } catch (err: any) {
        // Only log out on definitive auth failures (401/403), not transient network errors.
        // A network blip should not kill the user's session.
        const status = err?.response?.status ?? err?.status;
        if (status === 401 || status === 403) {
          store.logout();
        }
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);
}
