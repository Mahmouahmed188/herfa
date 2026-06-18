import { z } from 'zod';

// Basic Review Schema
export const ReviewSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  userId: z.string(),
  providerId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable(),
  status: z.enum(['visible', 'hidden', 'pending']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Complete Review Detail Schema
export const ReviewDetailSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  userId: z.string(),
  providerId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable(),
  status: z.enum(['visible', 'hidden', 'pending']),
  createdAt: z.string(),
  updatedAt: z.string(),
  customer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  provider: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  booking: z.object({
    id: z.string(),
    service: z.string(),
    scheduledDate: z.string(),
    scheduledTime: z.string(),
  }),
});

// Review Query Schema
export const ReviewQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(['visible', 'hidden', 'pending']).optional(),
  rating: z.number().min(1).max(5).optional(),
  providerId: z.string().optional(),
});

// Review List Response Schema
export const ReviewListResponseSchema = z.object({
  reviews: z.array(ReviewSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// Review Analytics Overview Schema
export const ReviewAnalyticsOverviewSchema = z.object({
  period: z.string(),
  totalReviews: z.number(),
  averageRating: z.number(),
  ratingTrend: z.array(z.object({
    date: z.string(),
    rating: z.number(),
    count: z.number(),
  })),
  ratingDistribution: z.array(z.object({
    rating: z.number().min(1).max(5),
    count: z.number(),
    percentage: z.number(),
  })),
  reviewSentiment: z.object({
    positive: z.number(),
    neutral: z.number(),
    negative: z.number(),
  }),
  reviewByService: z.array(z.object({
    service: z.string(),
    averageRating: z.number(),
    totalReviews: z.number(),
  })),
});

// Review Sentiment Analysis Schema
export const ReviewSentimentAnalysisSchema = z.object({
  sentimentAnalysis: z.array(z.object({
    date: z.string(),
    positive: z.number(),
    neutral: z.number(),
    negative: z.number(),
  })),
  commonKeywords: z.array(z.object({
    keyword: z.string(),
    positive: z.number(),
    negative: z.number(),
    total: z.number(),
  })),
  reviewTopics: z.array(z.object({
    topic: z.enum(['service', 'provider', 'price', 'communication', 'quality']),
    sentiment: z.enum(['positive', 'neutral', 'negative']),
    count: z.number(),
    percentage: z.number(),
  })),
});

// Review Action Schema
export const ReviewActionSchema = z.object({
  action: z.enum(['hide', 'restore']),
  reason: z.string(),
  notes: z.string().optional(),
});

// Review Hide Schema
export const ReviewHideSchema = z.object({
  reason: z.string(),
  notes: z.string().optional(),
});

// Review Restore Schema
export const ReviewRestoreSchema = z.object({
  notes: z.string().optional(),
});

// Export all schemas
export const ReviewSchemas = {
  base: ReviewSchema,
  detail: ReviewDetailSchema,
  query: ReviewQuerySchema,
  listResponse: ReviewListResponseSchema,
  analyticsOverview: ReviewAnalyticsOverviewSchema,
  sentimentAnalysis: ReviewSentimentAnalysisSchema,
  action: ReviewActionSchema,
  hide: ReviewHideSchema,
  restore: ReviewRestoreSchema,
};