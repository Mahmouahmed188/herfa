import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../services/api';
import type { 
  Review, 
  ReviewDetail, 
  ReviewQuery, 
  ReviewListResponse,
  ReviewAnalyticsOverview,
  ReviewSentimentAnalysis,
  ReviewAction,
  ReviewHide,
  ReviewRestore
} from '../types';

// Review Management Hooks
export const useReviews = (query: ReviewQuery) => {
  return useQuery({
    queryKey: ['reviews', query.page, query.limit, query.status, query.rating, query.providerId],
    queryFn: () => reviewsApi.getReviews(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useReviewDetail = (reviewId: string) => {
  return useQuery({
    queryKey: ['reviews', reviewId, 'detail'],
    queryFn: () => reviewsApi.getReviewDetail(reviewId),
    select: (response) => response.data,
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewStats = () => {
  return useQuery({
    queryKey: ['reviews', 'stats'],
    queryFn: () => reviewsApi.getReviewStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Review Analytics Hooks
export const useReviewAnalytics = (period = '30d') => {
  return useQuery({
    queryKey: ['reviews', 'analytics', period],
    queryFn: () => reviewsApi.getReviewAnalytics(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewSentiment = (period = '30d') => {
  return useQuery({
    queryKey: ['reviews', 'sentiment', period],
    queryFn: () => reviewsApi.getReviewSentiment(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewTrends = (period = '30d') => {
  return useQuery({
    queryKey: ['reviews', 'trends', period],
    queryFn: () => reviewsApi.getReviewTrends(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRatingDistribution = (period = '30d') => {
  return useQuery({
    queryKey: ['reviews', 'rating-distribution', period],
    queryFn: () => reviewsApi.getRatingDistribution(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useServiceRatings = (period = '30d') => {
  return useQuery({
    queryKey: ['reviews', 'service-ratings', period],
    queryFn: () => reviewsApi.getServiceRatings(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Review Hooks
export const useProviderReviews = (providerId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['providers', providerId, 'reviews', page, limit],
    queryFn: () => reviewsApi.getReviewsByProvider(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewsByRating = (rating: number) => {
  return useQuery({
    queryKey: ['reviews', 'rating', rating],
    queryFn: () => reviewsApi.getReviewsByRating(rating),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Moderation Hooks
export const useFlaggedReviews = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['reviews', 'flagged', page, limit],
    queryFn: () => reviewsApi.getFlaggedReviews(page, limit),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePendingModeration = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['reviews', 'pending-moderation', page, limit],
    queryFn: () => reviewsApi.getPendingModeration(page, limit),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Review Dashboard Hooks
export const useReviewDashboard = (period = '30d') => {
  return useQuery({
    queryKey: ['reviews', 'dashboard', period],
    queryFn: () => reviewsApi.getReviewDashboard(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRecentReviews = (limit = 10) => {
  return useQuery({
    queryKey: ['reviews', 'recent', limit],
    queryFn: () => reviewsApi.getRecentReviews(limit),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewNotifications = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['reviews', 'notifications', page, limit],
    queryFn: () => reviewsApi.getReviewNotifications(page, limit),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Review Reporting Hooks
export const useReviewReport = (type: 'summary' | 'detailed' | 'sentiment', period = '30d') => {
  return useQuery({
    queryKey: ['reviews', 'report', type, period],
    queryFn: () => reviewsApi.generateReviewReport(type, period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewInsights = (period = '30d') => {
  return useQuery({
    queryKey: ['reviews', 'insights', period],
    queryFn: () => reviewsApi.getReviewInsights(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewRecommendations = () => {
  return useQuery({
    queryKey: ['reviews', 'recommendations'],
    queryFn: () => reviewsApi.getReviewRecommendations(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const hideReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: ReviewHide }) => 
      reviewsApi.hideReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'stats'] });
    },
  });
};

export const restoreReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: ReviewRestore }) => 
      reviewsApi.restoreReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'stats'] });
    },
  });
};

export const bulkModerateReviews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (actions: Array<{
      reviewId: string;
      action: 'hide' | 'restore';
      reason: string;
      notes?: string;
    }>) => reviewsApi.bulkModerateReviews(actions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'stats'] });
    },
  });
};

// Search Hooks
export const useSearchReviews = (filters: {
  search?: string;
  status?: string;
  rating?: number;
  providerId?: string;
  dateRange?: string;
}) => {
  return useQuery({
    queryKey: ['reviews', 'search', filters],
    queryFn: () => reviewsApi.searchReviews(filters),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Export Hooks
export const useExportReviews = () => {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'json'; filters?: any }) => 
      reviewsApi.exportReviews(format, filters),
  });
};

// Real-time Updates Hook
export const useRealtimeReviewUpdates = () => {
  return useQuery({
    queryKey: ['reviews', 'realtime'],
    queryFn: () => Promise.resolve({ updates: [] }), // Placeholder - implement WebSocket connection
    select: (response) => response.updates,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1 minute
  });
};