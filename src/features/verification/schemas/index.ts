import { z } from 'zod';

// Verification Document Schema
export const VerificationDocumentSchema = z.object({
  id: z.string(),
  type: z.enum(['id', 'license', 'certificate', 'insurance', 'other']),
  url: z.string(),
  filename: z.string(),
  uploadedAt: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

// Verification History Schema
export const VerificationHistorySchema = z.object({
  id: z.string(),
  action: z.enum(['submitted', 'reviewed', 'approved', 'rejected', 'suspended']),
  adminId: z.string().nullable(),
  notes: z.string().nullable(),
  timestamp: z.string(),
});

// Basic Verification Schema
export const VerificationSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  providerEmail: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
  submittedAt: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  reviewedBy: z.string().nullable(),
});

// Complete Verification Schema
export const VerificationDetailSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  providerEmail: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
  documents: z.array(VerificationDocumentSchema),
  history: z.array(VerificationHistorySchema),
  submittedAt: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  reviewedBy: z.string().nullable(),
});

// Pending Verification Query Schema
export const PendingVerificationQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Pending Verification List Response Schema
export const PendingVerificationListResponseSchema = z.object({
  verifications: z.array(z.object({
    id: z.string(),
    providerId: z.string(),
    providerName: z.string(),
    providerEmail: z.string(),
    status: z.enum(['pending']),
    submittedAt: z.string().nullable(),
    documents: z.array(z.object({
      id: z.string(),
      type: z.enum(['id', 'license', 'certificate', 'insurance', 'other']),
      filename: z.string(),
      uploadedAt: z.string(),
    })),
  })),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// Verification Approval Schema
export const VerificationApprovalSchema = z.object({
  notes: z.string().optional(),
});

// Verification Rejection Schema
export const VerificationRejectionSchema = z.object({
  reason: z.string(),
  notes: z.string().optional(),
});

// Verification Action Schema
export const VerificationActionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
});

// Export all schemas
export const VerificationSchemas = {
  base: VerificationSchema,
  detail: VerificationDetailSchema,
  document: VerificationDocumentSchema,
  history: VerificationHistorySchema,
  pendingQuery: PendingVerificationQuerySchema,
  pendingListResponse: PendingVerificationListResponseSchema,
  approval: VerificationApprovalSchema,
  rejection: VerificationRejectionSchema,
  action: VerificationActionSchema,
};