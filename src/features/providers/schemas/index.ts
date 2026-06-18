import { z } from 'zod';

// Service Category Schema
export const ServiceCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
});

// Provider Ratings Schema
export const ProviderRatingsSchema = z.object({
  averageRating: z.number().min(0).max(5),
  totalReviews: z.number().min(0),
  ratingDistribution: z.object({
    5: z.number().min(0),
    4: z.number().min(0),
    3: z.number().min(0),
    2: z.number().min(0),
    1: z.number().min(0),
  }),
});

// Provider Service Schema
export const ProviderServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().min(0),
  duration: z.number().min(1),
});

// Provider Review Schema
export const ProviderReviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable(),
  createdAt: z.string(),
});

// Provider Statistics Schema
export const ProviderStatisticsSchema = z.object({
  totalBookings: z.number().min(0),
  completedBookings: z.number().min(0),
  cancelledBookings: z.number().min(0),
  totalEarnings: z.number().min(0),
  averageResponseTime: z.number().min(0),
});

// Basic Provider Schema
export const ProviderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  categories: z.array(ServiceCategorySchema),
  ratings: ProviderRatingsSchema,
  verification: z.object({
    status: z.enum(['pending', 'approved', 'suspended', 'rejected']),
    submittedAt: z.string().nullable(),
  }),
  isActive: z.boolean(),
  registrationDate: z.string(),
  lastActivity: z.string().nullable(),
});

// Complete Provider Schema
export const ProviderDetailSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  categories: z.array(ServiceCategorySchema),
  ratings: ProviderRatingsSchema,
  verification: z.object({
    status: z.enum(['pending', 'approved', 'suspended', 'rejected']),
    documents: z.array(z.object({
      id: z.string(),
      type: z.enum(['id', 'license', 'certificate', 'insurance', 'other']),
      url: z.string(),
      filename: z.string(),
      uploadedAt: z.string(),
      status: z.enum(['pending', 'approved', 'rejected']),
    })),
    history: z.array(z.object({
      id: z.string(),
      action: z.enum(['submitted', 'reviewed', 'approved', 'rejected', 'suspended']),
      adminId: z.string().nullable(),
      notes: z.string().nullable(),
      timestamp: z.string(),
    })),
    submittedAt: z.string().nullable(),
    reviewedAt: z.string().nullable(),
    reviewedBy: z.string().nullable(),
  }),
  services: z.array(ProviderServiceSchema),
  reviews: z.array(ProviderReviewSchema),
  statistics: ProviderStatisticsSchema,
  isActive: z.boolean(),
  registrationDate: z.string(),
  lastActivity: z.string().nullable(),
});

// Provider List Query Schema
export const ProviderListQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['pending', 'approved', 'suspended', 'rejected']).optional(),
  category: z.string().optional(),
});

// Provider List Response Schema
export const ProviderListResponseSchema = z.object({
  providers: z.array(ProviderSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// Provider Status Update Schema
export const ProviderStatusUpdateSchema = z.object({
  status: z.enum(['approved', 'suspended', 'reactivated']),
  notes: z.string().optional(),
});

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

// Verification Schema
export const VerificationSchema = z.object({
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

// Verification List Response Schema
export const VerificationListResponseSchema = z.object({
  verifications: z.array(VerificationSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// Export all schemas
export const ProviderSchemas = {
  base: ProviderSchema,
  detail: ProviderDetailSchema,
  ratings: ProviderRatingsSchema,
  service: ProviderServiceSchema,
  review: ProviderReviewSchema,
  statistics: ProviderStatisticsSchema,
  listQuery: ProviderListQuerySchema,
  listResponse: ProviderListResponseSchema,
  statusUpdate: ProviderStatusUpdateSchema,
  verification: VerificationSchema,
  verificationDocument: VerificationDocumentSchema,
  verificationHistory: VerificationHistorySchema,
  verificationListResponse: VerificationListResponseSchema,
};