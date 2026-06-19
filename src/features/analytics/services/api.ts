import { api } from '@/lib/axios';
import { AnalyticsSchemas } from '../schemas';
import type { 
  DashboardOverview, 
  RevenueAnalytics, 
  UserAnalytics, 
  ProviderAnalytics, 
  ChartData,
  AnalyticsQuery,
  ChartQuery 
} from '../types';

export const analyticsApi = {
  /**
   * Get dashboard overview with KPIs
   */
  getDashboardOverview: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/admin/dashboard/overview', { params });
    return AnalyticsSchemas.dashboardOverview.parse(response.data);
  },

  /**
   * Get revenue overview analytics
   */
  getRevenueOverview: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/revenue/overview', { params });
    return AnalyticsSchemas.revenueAnalytics.parse(response.data);
  },

  /**
   * Get revenue chart data
   */
  getRevenueChartData: async (query?: ChartQuery) => {
    const params = {
      chartType: query?.chartType || 'line',
      period: query?.period || '30d',
      granularity: query?.granularity || 'daily',
    };

    const response = await api.get('/analytics/revenue/charts', { params });
    return AnalyticsSchemas.chartData.parse(response.data);
  },

  /**
   * Get user analytics overview
   */
  getUserAnalytics: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/users/overview', { params });
    return AnalyticsSchemas.userAnalytics.parse(response.data);
  },

  /**
   * Get user behavior analytics
   */
  getUserBehavior: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/users/behavior', { params });
    return response.data;
  },

  /**
   * Get provider analytics overview
   */
  getProviderAnalytics: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/providers/overview', { params });
    return AnalyticsSchemas.providerAnalytics.parse(response.data);
  },

  /**
   * Get provider service analytics
   */
  getProviderServices: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/providers/services', { params });
    return response.data;
  },

  /**
   * Get booking analytics overview
   */
  getBookingAnalytics: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/bookings/overview', { params });
    return response.data;
  },

  /**
   * Get booking conversion analytics
   */
  getBookingConversion: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/bookings/conversion', { params });
    return response.data;
  },

  /**
   * Get review analytics overview
   */
  getReviewAnalytics: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/reviews/overview', { params });
    return response.data;
  },

  /**
   * Get review sentiment analysis
   */
  getReviewSentiment: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/reviews/sentiment', { params });
    return response.data;
  },

  /**
   * Get support analytics overview
   */
  getSupportAnalytics: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/support/overview', { params });
    return response.data;
  },

  /**
   * Get support performance metrics
   */
  getSupportPerformance: async (query?: AnalyticsQuery) => {
    const params = {
      period: query?.period || '30d',
      compare: query?.compare || false,
      ...(query?.startDate && { startDate: query.startDate }),
      ...(query?.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/analytics/support/performance', { params });
    return response.data;
  },
};