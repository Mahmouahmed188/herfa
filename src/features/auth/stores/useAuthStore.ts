import { create } from 'zustand';
import { User } from '@/types/api';
import { sessionService } from '../services/session';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshTokenExists: boolean;
  isInitializing: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string | null) => void;
  setRefreshTokenExists: (exists: boolean) => void;
  setInitializing: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    token: null,
    refreshTokenExists: false,
    isInitializing: true, // true until useInitializeAuth resolves
    login: (user, token) => {
      console.log('Auth Store - Login:', { user, token });
      sessionService.setTokenCookie(token);
      // Also store in localStorage as fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem('herfa_token', token);
      }
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      console.log('Auth Store - Logout - EMERGENCY FIX: Available but not auto-triggered');
      sessionService.removeTokenCookie();
      // Also remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('herfa_token');
      }
      set({ user: null, token: null, isAuthenticated: false, refreshTokenExists: false });
    },
    updateUser: (updatedUser) =>
      set((state) => {
        const newUser = state.user ? { ...state.user, ...updatedUser } : null;
        console.log('Auth Store - Update User:', { updatedUser, newUser });
        return { user: newUser };
      }),
    setToken: (token) => {
      console.log('Auth Store - Set Token:', { token });
      if (token) {
        sessionService.setTokenCookie(token);
        // Also store in localStorage as fallback
        if (typeof window !== 'undefined') {
          localStorage.setItem('herfa_token', token);
        }
      } else {
        sessionService.removeTokenCookie();
        // Also remove from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('herfa_token');
        }
      }
      set({ token });
    },
    setRefreshTokenExists: (exists) => {
      console.log('Auth Store - Set Refresh Token Exists:', { exists });
      set({ refreshTokenExists: exists });
    },
    setInitializing: (value) => {
      console.log('Auth Store - Set Initializing:', { value });
      set({ isInitializing: value });
    },
  })
);
