import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import type { AnalyticsQuery, ChartQuery } from '../types';

export const useDashboardAnalytics = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['dashboard', 'analytics', query?.period || '30d', query?.compare],
    queryFn: () => dashboardApi.getDashboardOverview(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRevenueChartData = (query?: ChartQuery) => {
  return useQuery({
    queryKey: ['dashboard', 'revenue-chart', query?.period || '30d'],
    queryFn: () => dashboardApi.getRevenueAnalytics(query?.period || '30d'),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBookingChartData = (query?: ChartQuery) => {
  return useQuery({
    queryKey: ['dashboard', 'booking-chart', query?.period || '30d'],
    queryFn: () => dashboardApi.getBookingAnalytics(query?.period || '30d'),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUserEngagementMetrics = (period = '30d') => {
  return useQuery({
    queryKey: ['dashboard', 'user-engagement', period],
    queryFn: () => dashboardApi.getUserEngagement(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProviderPerformanceMetrics = (period = '30d') => {
  return useQuery({
    queryKey: ['dashboard', 'provider-performance', period],
    queryFn: () => dashboardApi.getProviderPerformance(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
