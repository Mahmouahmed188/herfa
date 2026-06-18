'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { refreshToken, getCurrentUser } from '@/services/api';

export function useInitializeAuth() {
  const { setToken, setRefreshTokenExists, login, setInitializing } = useAuthStore();
  // Prevent double-invocation in React 18 Strict Mode (dev only).
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function init() {
      try {
        const result = await refreshToken();
        if (result?.accessToken) {
          setRefreshTokenExists(true);

          try {
            const user = await getCurrentUser();
            if (user) {
              login(user, result.accessToken);
            } else {
              setToken(result.accessToken);
            }
          } catch {
            // User fetch failed but token is valid — preserve auth state.
            setToken(result.accessToken);
          }
        }
      } catch {
        setRefreshTokenExists(false);
      } finally {
        setInitializing(false);
      }
    }

    init();
  }, []);
}
