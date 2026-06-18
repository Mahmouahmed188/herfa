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

    console.log('useInitializeAuth - Starting auth initialization');

    async function init() {
      try {
        console.log('useInitializeAuth - Attempting to refresh token');
        const result = await refreshToken();
        console.log('useInitializeAuth - Refresh token result:', result);

        if (result?.accessToken) {
          console.log('useInitializeAuth - Token refreshed successfully');
          setRefreshTokenExists(true);

          try {
            console.log('useInitializeAuth - Fetching current user');
            const user = await getCurrentUser();
            console.log('useInitializeAuth - User fetched:', user);
            if (user) {
              login(user, result.accessToken);
            } else {
              console.log('useInitializeAuth - No user data, setting token only');
              setToken(result.accessToken);
            }
          } catch (error) {
            console.error('useInitializeAuth - User fetch failed:', error);
            // User fetch failed but token is valid — preserve auth state.
            setToken(result.accessToken);
          }
        } else {
          console.log('useInitializeAuth - No access token received');
        }
      } catch (error) {
        console.error('useInitializeAuth - Token refresh failed:', error);
        setRefreshTokenExists(false);
      } finally {
        console.log('useInitializeAuth - Auth initialization complete');
        setInitializing(false);
      }
    }

    init();
  }, []);
}
