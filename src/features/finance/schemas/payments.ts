import { z } from 'zod';

export const paymentStatusSchema = z.enum([
  'PENDING',
  'AUTHORIZED',
  'PAID',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
  'FAILED',
  'CANCELLED',
]);

export const paymentSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('SAR'),
  status: paymentStatusSchema,
  paymentMethod: z.string(),
  transactionRef: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const processPaymentSchema = z.object({
  paymentMethod: z.string(),
  transactionRef: z.string().optional(),
});

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
