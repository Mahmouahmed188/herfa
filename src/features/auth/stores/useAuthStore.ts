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
  (set) => ({
    user: null,
    isAuthenticated: false,
    token: null,
    refreshTokenExists: false,
    isInitializing: true, // true until useInitializeAuth resolves
    login: (user, token) => {
      sessionService.setTokenCookie(token);
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      sessionService.removeTokenCookie();
      set({ user: null, token: null, isAuthenticated: false, refreshTokenExists: false });
    },
    updateUser: (updatedUser) =>
      set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : null,
      })),
    setToken: (token) => {
      if (token) {
        sessionService.setTokenCookie(token);
      } else {
        sessionService.removeTokenCookie();
      }
      set({ token });
    },
    setRefreshTokenExists: (exists) => set({ refreshTokenExists: exists }),
    setInitializing: (value) => set({ isInitializing: value }),
  })
);
