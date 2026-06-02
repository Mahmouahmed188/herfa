import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/api';
import { sessionService } from '../services/session';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * Auth store for managing admin session state.
 * Aligns with the "Feature-Based Architecture" and "State Management Rules".
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: sessionService.getToken(),
      login: (user, token) => {
        sessionService.setToken(token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        sessionService.removeToken();
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: 'herfa-admin-auth',
    }
  )
);
