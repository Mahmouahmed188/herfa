import { api } from '@/lib/axios';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Review, ReviewCreateRequest, ReviewUpdateRequest, ReviewDetail, RatingStats, ReviewFilters, AdminReviewFilters, AnalyticsData } from '../types';

export const reviewApi = {
  createReview: async (data: ReviewCreateRequest) => {
    const response = await api.post<ApiResponse<Review>>('/reviews', data);
    return response.data;
  },

  getCustomerReviews: async (params?: ReviewFilters) => {
    const response = await api.get<PaginatedResponse<Review>>('/reviews', { params });
    return response.data;
  },

  getProviderReviews: async (params?: ReviewFilters) => {
    const response = await api.get<PaginatedResponse<Review>>('/reviews/provider', { params });
    return response.data;
  },

  getReviewDetail: async (id: string) => {
    const response = await api.get<ApiResponse<ReviewDetail>>(`/reviews/${id}`);
    return response.data;
  },

  updateReview: async (id: string, data: ReviewUpdateRequest) => {
    const response = await api.patch<ApiResponse<Review>>(`/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/reviews/${id}`);
    return response.data;
  },

  flagReview: async (id: string) => {
    const response = await api.post<ApiResponse<{ message: string }>>(`/reviews/${id}/flag`);
    return response.data;
  },

  getProviderPublicReviews: async (providerId: string, params?: ReviewFilters) => {
    const response = await api.get<PaginatedResponse<ReviewDetail>>(`/providers/${providerId}/reviews`, { params });
    return response.data;
  },

  getAdminReviews: async (params?: AdminReviewFilters) => {
    const response = await api.get<PaginatedResponse<ReviewDetail>>('/reviews/admin', { params });
    return response.data;
  },

  moderateReview: async (id: string, action: 'APPROVED' | 'REJECTED', reason?: string) => {
    const response = await api.patch<ApiResponse<ReviewDetail>>(`/reviews/${id}/moderate`, { action, reason });
    return response.data;
  },

  getAnalytics: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get<ApiResponse<AnalyticsData>>('/analytics/reviews', { params });
    return response.data;
  },
};

export function getProviderRatingStats(providerId: string): Promise<ApiResponse<RatingStats>> {
  return api.get(`/providers/${providerId}/ratings`).then((res) => res.data);
}
