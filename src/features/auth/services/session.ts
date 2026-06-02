import { cookies } from 'next/headers';

const TOKEN_KEY = 'herfa_token';
const SESSION_EXPIRY_DAYS = 7;

/**
 * Session service for managing authentication tokens securely.
 * Aligns with the "Frontend Security Rules" and "Secure Token Handling" standards.
 */
export const sessionService = {
  setToken(token: string) {
    if (typeof window === 'undefined') return;
    
    // Set cookie for middleware access
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${
      SESSION_EXPIRY_DAYS * 24 * 60 * 60
    }; SameSite=Lax; Secure`;
    
    // Also store in localStorage if needed for client-side persistence
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken() {
    if (typeof window === 'undefined') return;
    
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    localStorage.removeItem(TOKEN_KEY);
  },

  isValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // In a real app, we would decode the JWT and check expiry
    // const decoded = jwtDecode(token);
    // return decoded.exp * 1000 > Date.now();
    return true;
  }
};
