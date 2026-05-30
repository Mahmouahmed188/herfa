import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const verificationSchema = z.object({
  providerId: z.string().min(1),
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().min(5).optional(),
});

const payoutSchema = z.object({
  providerId: z.string().min(1),
  amount: z.number().positive(),
  method: z.enum(['BANK_TRANSFER', 'WALLET']),
});

describe('Verification Schema', () => {
  it('accepts valid input', () => {
    const result = verificationSchema.safeParse({
      providerId: 'prov_123',
      status: 'APPROVED',
      notes: 'All documents verified',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty providerId', () => {
    const result = verificationSchema.safeParse({
      providerId: '',
      status: 'APPROVED',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status', () => {
    const result = verificationSchema.safeParse({
      providerId: 'prov_123',
      status: 'INVALID',
    });
    expect(result.success).toBe(false);
  });
});

describe('Payout Schema', () => {
  it('accepts valid payout', () => {
    const result = payoutSchema.safeParse({
      providerId: 'prov_456',
      amount: 500,
      method: 'BANK_TRANSFER',
    });
    expect(result.success).toBe(true);
  });

  it('rejects zero amount', () => {
    const result = payoutSchema.safeParse({
      providerId: 'prov_456',
      amount: 0,
      method: 'WALLET',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative amount', () => {
    const result = payoutSchema.safeParse({
      providerId: 'prov_456',
      amount: -100,
      method: 'BANK_TRANSFER',
    });
    expect(result.success).toBe(false);
  });
});
