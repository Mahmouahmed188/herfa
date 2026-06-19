import { api } from '@/lib/axios';
import { ReviewSchemas } from '../schemas';
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

export const reviewsApi = {
  // Review Management
  /**
   * Get paginated list of reviews
   */
  getReviews: async (query: ReviewQuery) => {
    const params = {
      page: query.page,
      limit: query.limit,
      ...(query.status && { status: query.status }),
      ...(query.rating && { rating: query.rating }),
      ...(query.providerId && { providerId: query.providerId }),
    };

    const response = await api.get('/admin/reviews', { params });
    return ReviewSchemas.listResponse.parse(response.data);
  },

  /**
   * Get detailed review information
   */
  getReviewDetail: async (reviewId: string) => {
    const response = await api.get(`/admin/reviews/${reviewId}`);
    return ReviewSchemas.detail.parse(response.data);
  },

  /**
   * Hide a review
   */
  hideReview: async (reviewId: string, data: ReviewHide) => {
    const response = await api.post(`/admin/reviews/${reviewId}/hide`, data);
    return response.data;
  },

  /**
   * Restore a hidden review
   */
  restoreReview: async (reviewId: string, data: ReviewRestore) => {
    const response = await api.post(`/admin/reviews/${reviewId}/restore`, data);
    return response.data;
  },

  /**
   * Get review statistics
   */
  getReviewStats: async () => {
    const response = await api.get('/admin/reviews/stats');
    return response.data;
  },

  /**
   * Get reviews by rating
   */
  getReviewsByRating: async (rating: number) => {
    const response = await api.get(`/admin/reviews/rating/${rating}`);
    return response.data;
  },

  /**
   * Get reviews by provider
   */
  getReviewsByProvider: async (providerId: string) => {
    const response = await api.get(`/admin/reviews/provider/${providerId}`);
    return response.data;
  },

  /**
   * Search reviews
   */
  searchReviews: async (query: {
    search?: string;
    status?: string;
    rating?: number;
    providerId?: string;
    dateRange?: string;
  }) => {
    const response = await api.get('/admin/reviews/search', { params: query });
    return response.data;
  },

  /**
   * Export reviews
   */
  exportReviews: async (format: 'csv' | 'excel' | 'json', filters?: any) => {
    const params = { format, ...filters };
    const response = await api.get('/admin/reviews/export', { params });
    return response.data;
  },

  // Review Analytics
  /**
   * Get review analytics overview
   */
  getReviewAnalytics: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/reviews/analytics', { params });
    return ReviewSchemas.analyticsOverview.parse(response.data);
  },

  /**
   * Get review sentiment analysis
   */
  getReviewSentiment: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/reviews/sentiment', { params });
    return ReviewSchemas.sentimentAnalysis.parse(response.data);
  },

  /**
   * Get review trends
   */
  getReviewTrends: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/reviews/trends', { params });
    return response.data;
  },

  /**
   * Get rating distribution
   */
  getRatingDistribution: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/reviews/rating-distribution', { params });
    return response.data;
  },

  /**
   * Get service ratings
   */
  getServiceRatings: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/reviews/service-ratings', { params });
    return response.data;
  },

  // Moderation
  /**
   * Get flagged reviews
   */
  getFlaggedReviews: async (page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get('/admin/reviews/flagged', { params });
    return response.data;
  },

  /**
   * Get pending moderation reviews
   */
  getPendingModeration: async (page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get('/admin/reviews/pending-moderation', { params });
    return response.data;
  },

  /**
   * Bulk review moderation
   */
  bulkModerateReviews: async (actions: Array<{
    reviewId: string;
    action: 'hide' | 'restore';
    reason: string;
    notes?: string;
  }>) => {
    const response = await api.post('/admin/reviews/bulk-moderate', { actions });
    return response.data;
  },

  // Dashboard
  /**
   * Get review dashboard data
   */
  getReviewDashboard: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/reviews/dashboard', { params });
    return response.data;
  },

  /**
   * Get recent reviews
   */
  getRecentReviews: async (limit = 10) => {
    const params = { limit };
    const response = await api.get('/admin/reviews/recent', { params });
    return response.data;
  },

  /**
   * Get review notifications
   */
  getReviewNotifications: async (page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get('/admin/reviews/notifications', { params });
    return response.data;
  },

  // Reporting
  /**
   * Generate review report
   */
  generateReviewReport: async (type: 'summary' | 'detailed' | 'sentiment', period = '30d') => {
    const params = { type, period };
    const response = await api.get('/admin/reviews/report', { params });
    return response.data;
  },

  /**
   * Get review insights
   */
  getReviewInsights: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/reviews/insights', { params });
    return response.data;
  },

  /**
   * Get review recommendations
   */
  getReviewRecommendations: async () => {
    const response = await api.get('/admin/reviews/recommendations');
    return response.data;
  },
};