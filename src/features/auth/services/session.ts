const TOKEN_KEY = 'herfa_token';

/**
 * Session service for managing authentication tokens.
 * Access tokens are stored in-memory via Zustand (secure).
 * Refresh tokens are handled via httpOnly cookies set by the backend.
 * The document cookie here is a thin bridge for Next.js middleware auth checks.
 */
export const sessionService = {
  setTokenCookie(token: string) {
    if (typeof window === 'undefined') return;
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=1800; SameSite=Lax${secure}`;
  },

  removeTokenCookie() {
    if (typeof window === 'undefined') return;
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },

  /**
   * Check if we have a token available (client-side fallback for middleware)
   */
  hasToken(): boolean {
    if (typeof window === 'undefined') return false;
    const cookies = document.cookie.split(';');
    return cookies.some(cookie => cookie.trim().startsWith(`${TOKEN_KEY}=`));
  },

  /**
   * Get token from client-side cookies (fallback)
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${TOKEN_KEY}=`));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  },
};
