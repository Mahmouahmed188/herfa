import { z } from 'zod';

/**
 * Zod schema for provider verification status.
 * Aligns with the "Type-Safe Enterprise Excellence" principle.
 */
export const verificationStatusSchema = z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED']);

export const documentStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

export const documentTypeSchema = z.enum([
  'NATIONAL_ID',
  'PASSPORT',
  'DRIVER_LICENSE',
  'PROFESSIONAL_CERTIFICATE',
  'TRADE_LICENSE',
  'BUSINESS_REGISTRATION',
]);

export const documentSchema = z.object({
  id: z.string(),
  type: documentTypeSchema,
  url: z.string().url(),
  filename: z.string().optional(),
  status: documentStatusSchema,
  rejectionReason: z.string().optional(),
  uploadedAt: z.string().optional(),
});

export const providerVerificationSchema = z.object({
  id: z.string(),
  providerName: z.string(),
  providerId: z.string().optional(),
  submittedAt: z.string(),
  approvedAt: z.string().optional(),
  reviewedBy: z.string().optional(),
  adminNote: z.string().optional(),
  documents: z.array(documentSchema),
  status: verificationStatusSchema,
  portfolio: z.array(z.string()).optional(),
  frontIdImage: z.string().optional(),
  backIdImage: z.string().optional(),
  personalPhoto: z.string().optional(),
});

export const verificationHistoryEventSchema = z.object({
  id: z.string(),
  eventType: z.enum([
    'SUBMITTED',
    'STATUS_CHANGE',
    'DOCUMENT_UPLOADED',
    'DOCUMENT_REPLACED',
    'DOCUMENT_REJECTED',
    'REVIEWER_ASSIGNED',
    'NOTE_ADDED',
    'RESUBMITTED',
  ]),
  fromStatus: verificationStatusSchema.optional(),
  toStatus: verificationStatusSchema.optional(),
  actor: z.string().optional(),
  description: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
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
export type DocumentStatus = z.infer<typeof documentStatusSchema>;
export type DocumentType = z.infer<typeof documentTypeSchema>;
export type Document = z.infer<typeof documentSchema>;
export type ProviderVerification = z.infer<typeof providerVerificationSchema>;
export type VerificationHistoryEvent = z.infer<typeof verificationHistoryEventSchema>;
export type ApproveProviderInput = z.infer<typeof approveProviderSchema>;
export type RejectProviderInput = z.infer<typeof rejectProviderSchema>;
