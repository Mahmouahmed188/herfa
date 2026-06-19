import { api } from '@/lib/axios';
import { DashboardSchemas } from '../schemas';
import type { 
  DashboardOverview,
  SystemHealth,
  RecentActivity,
  PlatformOverview,
  BusinessMetrics,
  GrowthMetrics,
  ActivityMetrics,
  AnalyticsQuery,
  ChartQuery
} from '../types';

export const dashboardApi = {
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
    return DashboardSchemas.overview.parse(response.data);
  },

  /**
   * Get system health status
   */
  getSystemHealth: async () => {
    const response = await api.get('/admin/dashboard/system-health');
    return DashboardSchemas.systemHealth.parse(response.data);
  },

  /**
   * Get recent activity feed
   */
  getRecentActivity: async (limit = 20) => {
    const params = { limit };
    const response = await api.get('/admin/dashboard/recent-activity', { params });
    return DashboardSchemas.recentActivity.parse(response.data);
  },

  /**
   * Get platform overview statistics
   */
  getPlatformOverview: async () => {
    const response = await api.get('/admin/dashboard/platform-overview');
    return DashboardSchemas.platformOverview.parse(response.data);
  },

  /**
   * Get business metrics
   */
  getBusinessMetrics: async () => {
    const response = await api.get('/admin/dashboard/business-metrics');
    return DashboardSchemas.businessMetrics.parse(response.data);
  },

  /**
   * Get growth metrics
   */
  getGrowthMetrics: async () => {
    const response = await api.get('/admin/dashboard/growth-metrics');
    return DashboardSchemas.growthMetrics.parse(response.data);
  },

  /**
   * Get activity metrics
   */
  getActivityMetrics: async () => {
    const response = await api.get('/admin/dashboard/activity-metrics');
    return DashboardSchemas.activityMetrics.parse(response.data);
  },

  /**
   * Get real-time dashboard updates
   */
  getRealtimeUpdates: async () => {
    const response = await api.get('/admin/dashboard/realtime-updates');
    return response.data;
  },

  /**
   * Get dashboard widgets configuration
   */
  getDashboardWidgets: async () => {
    const response = await api.get('/admin/dashboard/widgets');
    return response.data;
  },

  /**
   * Update dashboard widgets configuration
   */
  updateDashboardWidgets: async (widgets: any[]) => {
    const response = await api.post('/admin/dashboard/widgets', { widgets });
    return response.data;
  },

  /**
   * Get dashboard layout
   */
  getDashboardLayout: async () => {
    const response = await api.get('/admin/dashboard/layout');
    return response.data;
  },

  /**
   * Save dashboard layout
   */
  saveDashboardLayout: async (layout: any) => {
    const response = await api.post('/admin/dashboard/layout', { layout });
    return response.data;
  },

  /**
   * Get dashboard templates
   */
  getDashboardTemplates: async () => {
    const response = await api.get('/admin/dashboard/templates');
    return response.data;
  },

  /**
   * Create dashboard template
   */
  createDashboardTemplate: async (template: {
    name: string;
    description: string;
    layout: any;
    widgets: any[];
  }) => {
    const response = await api.post('/admin/dashboard/templates', template);
    return response.data;
  },

  /**
   * Export dashboard data
   */
  exportDashboard: async (format: 'csv' | 'pdf' | 'excel', options?: any) => {
    const params = { format, ...options };
    const response = await api.get('/admin/dashboard/export', { params });
    return response.data;
  },

  /**
   * Get dashboard notifications
   */
  getDashboardNotifications: async () => {
    const response = await api.get('/admin/dashboard/notifications');
    return response.data;
  },

  /**
   * Mark dashboard notifications as read
   */
  markNotificationsRead: async (notificationIds: string[]) => {
    const response = await api.post('/admin/dashboard/notifications/read', { notificationIds });
    return response.data;
  },

  /**
   * Get dashboard performance metrics
   */
  getDashboardPerformance: async () => {
    const response = await api.get('/admin/dashboard/performance');
    return response.data;
  },

  /**
   * Get dashboard error logs
   */
  getDashboardErrors: async (page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get('/admin/dashboard/errors', { params });
    return response.data;
  },

  /**
   * Get user engagement metrics
   */
  getUserEngagement: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/dashboard/user-engagement', { params });
    return response.data;
  },

  /**
   * Get provider performance metrics
   */
  getProviderPerformance: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/dashboard/provider-performance', { params });
    return response.data;
  },

  /**
   * Get booking analytics
   */
  getBookingAnalytics: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/dashboard/booking-analytics', { params });
    return response.data;
  },

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/dashboard/revenue-analytics', { params });
    return response.data;
  },

  /**
   * Get support analytics
   */
  getSupportAnalytics: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/dashboard/support-analytics', { params });
    return response.data;
  },

  /**
   * Get system alerts
   */
  getSystemAlerts: async () => {
    const response = await api.get('/admin/dashboard/system-alerts');
    return response.data;
  },

  /**
   * Acknowledge system alert
   */
  acknowledgeAlert: async (alertId: string) => {
    const response = await api.post(`/admin/dashboard/system-alerts/${alertId}/acknowledge`);
    return response.data;
  },
};