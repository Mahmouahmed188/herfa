import { api } from '@/lib/axios';
import { ApiResponse, BaseEntity } from '@/types/api';

export interface AnalyticsOverview {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  userGrowth: number;
  revenueGrowth: number;
  bookingGrowth: number;
  conversionRate: number;
  retentionRate: number;
  period: string;
}

export interface RevenueChartData {
  labels: string[];
  datasets: { label: string; values: number[] }[];
}

export interface ConversionFunnel {
  stage: string;
  count: number;
  rate: number;
}

export const analyticsApi = {
  getOverview: async (period?: string) => {
    const response = await api.get<ApiResponse<AnalyticsOverview>>('/analytics/overview', { params: { period } });
    return response.data;
  },

  getRevenueChart: async (period?: string) => {
    const response = await api.get<ApiResponse<RevenueChartData>>('/analytics/revenue', { params: { period } });
    return response.data;
  },

  getBookingChart: async (period?: string) => {
    const response = await api.get<ApiResponse<RevenueChartData>>('/analytics/bookings', { params: { period } });
    return response.data;
  },

  getConversionFunnel: async () => {
    const response = await api.get<ApiResponse<ConversionFunnel[]>>('/analytics/conversion-funnel');
    return response.data;
  },

  getRetentionReport: async () => {
    const response = await api.get<ApiResponse<RevenueChartData>>('/analytics/retention');
    return response.data;
  },
};
