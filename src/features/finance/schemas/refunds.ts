import { z } from 'zod';

export const refundStatusSchema = z.enum([
  'REQUESTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'PROCESSED',
  'COMPLETED',
]);

export const refundSchema = z.object({
  id: z.string().uuid(),
  paymentId: z.string().uuid(),
  amount: z.number().positive(),
  reason: z.string().min(1, 'Reason is required'),
  status: refundStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createRefundSchema = z.object({
  amount: z.number().positive(),
  reason: z.string().min(1, 'Reason is required'),
});

export type RefundStatus = z.infer<typeof refundStatusSchema>;
export type Refund = z.infer<typeof refundSchema>;
export type CreateRefundInput = z.infer<typeof createRefundSchema>;
