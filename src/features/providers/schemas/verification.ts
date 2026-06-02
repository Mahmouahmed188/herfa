import { z } from 'zod';

/**
 * Zod schema for provider verification status.
 * Aligns with the "Type-Safe Enterprise Excellence" principle.
 */
export const verificationStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

export const documentSchema = z.object({
  id: z.string(),
  type: z.string(), // e.g., 'ID_CARD', 'LICENSE', 'CERTIFICATE'
  url: z.string().url(),
  status: verificationStatusSchema,
  rejectionReason: z.string().optional(),
});

export const providerVerificationSchema = z.object({
  id: z.string(),
  providerName: z.string(),
  submittedAt: z.string(),
  documents: z.array(documentSchema),
  status: verificationStatusSchema,
});

export const approveProviderSchema = z.object({
  providerId: z.string(),
  notes: z.string().optional(),
});

export const rejectProviderSchema = z.object({
  providerId: z.string(),
  reason: z.string().min(5, 'Rejection reason must be at least 5 characters'),
  documentIds: z.array(z.string()).optional(),
});

export type VerificationStatus = z.infer<typeof verificationStatusSchema>;
export type Document = z.infer<typeof documentSchema>;
export type ProviderVerification = z.infer<typeof providerVerificationSchema>;
export type ApproveProviderInput = z.infer<typeof approveProviderSchema>;
export type RejectProviderInput = z.infer<typeof rejectProviderSchema>;
