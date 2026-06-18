'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { refreshToken, getCurrentUser } from '@/services/api';

export function useInitializeAuth() {
  const { setToken, setRefreshTokenExists, login, setInitializing, isAuthenticated } = useAuthStore();
  // Prevent double-invocation in React 18 Strict Mode (dev only).
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    console.log('useInitializeAuth - Starting auth initialization');

    async function init() {
      try {
        // Check localStorage first as fallback
        if (typeof window !== 'undefined') {
          const localStorageToken = localStorage.getItem('herfa_token');
          if (localStorageToken && !isAuthenticated) {
            console.log('useInitializeAuth - Found token in localStorage, setting it');
            setToken(localStorageToken);
            // Try to fetch user with this token
            try {
              const user = await getCurrentUser();
              if (user) {
                login(user, localStorageToken);
              }
            } catch (error) {
              console.error('useInitializeAuth - User fetch failed with localStorage token:', error);
              // Keep the token but don't set user data
              setToken(localStorageToken);
            }
          }
        }

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
          console.log('useInitializeAuth - No access token received - not authenticated');
          setRefreshTokenExists(false);
        }
      } catch (error) {
        console.error('useInitializeAuth - Token refresh failed:', error);
        setRefreshTokenExists(false);
        // EMERGENCY FIX: Don't force login on token refresh failure
        console.log('useInitializeAuth - EMERGENCY FIX: Not forcing login on refresh failure');
      } finally {
        console.log('useInitializeAuth - Auth initialization complete');
        setInitializing(false);
      }
    }

    init();
  }, [isAuthenticated]);
}
