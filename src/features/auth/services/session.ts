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
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=1800; SameSite=Lax; Secure`;
  },

  removeTokenCookie() {
    if (typeof window === 'undefined') return;
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};
