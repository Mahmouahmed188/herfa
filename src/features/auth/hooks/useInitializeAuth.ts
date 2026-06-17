'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { refreshToken, getCurrentUser } from '@/services/api';

export function useInitializeAuth() {
  const { setToken, setRefreshTokenExists, login } = useAuthStore();

  useEffect(() => {
    async function init() {
      try {
        const result = await refreshToken();
        if (result?.accessToken) {
          setToken(result.accessToken);
          setRefreshTokenExists(true);

          try {
            const user = await getCurrentUser();
            if (user) {
              login(user, result.accessToken);
            }
          } catch {
            // User fetch failed but token is valid — proceed with token only
          }
        }
      } catch {
        setRefreshTokenExists(false);
      }
    }

    init();
  }, []);
}
