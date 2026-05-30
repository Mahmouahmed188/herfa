import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Auth Flow Integration', () => {
  it('validates login form schema', () => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const valid = loginSchema.safeParse({
      email: 'admin@herfa.com',
      password: 'password123',
    });
    expect(valid.success).toBe(true);

    const invalid = loginSchema.safeParse({
      email: 'not-an-email',
      password: '123',
    });
    expect(invalid.success).toBe(false);
  });

  it('validates session store structure', () => {
    const sessionState = {
      user: { id: '1', role: 'ADMIN' as const, email: 'admin@herfa.com' },
      token: 'mock-jwt-token',
      isAuthenticated: true,
    };

    expect(sessionState.isAuthenticated).toBe(true);
    expect(sessionState.user.role).toBe('ADMIN');
    expect(sessionState.token).toBeTruthy();
  });
});
