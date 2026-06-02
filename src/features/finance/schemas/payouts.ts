import { z } from 'zod';

export const payoutStatusSchema = z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']);

export const payoutRequestSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  amount: z.number(),
  currency: z.string().default('SAR'),
  status: payoutStatusSchema,
  requestedAt: z.string(),
  processedAt: z.string().optional(),
  bankDetails: z.object({
    bankName: z.string(),
    iban: z.string(),
    accountHolder: z.string(),
  }).optional(),
});

export const processPayoutSchema = z.object({
  payoutIds: z.array(z.string()),
  action: z.enum(['APPROVE', 'REJECT']),
  notes: z.string().optional(),
});

export type PayoutStatus = z.infer<typeof payoutStatusSchema>;
export type PayoutRequest = z.infer<typeof payoutRequestSchema>;
export type ProcessPayoutInput = z.infer<typeof processPayoutSchema>;
