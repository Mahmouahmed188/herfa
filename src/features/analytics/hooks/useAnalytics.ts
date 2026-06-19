import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../services/api';
import type { 
  DashboardOverview, 
  RevenueAnalytics, 
  UserAnalytics, 
  ProviderAnalytics, 
  ChartData,
  AnalyticsQuery,
  ChartQuery 
} from '../types';

// Dashboard Overview Hook
export const useDashboardOverview = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['dashboard', 'overview', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getDashboardOverview(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Revenue Analytics Hooks
export const useRevenueOverview = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['revenue', 'overview', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getRevenueOverview(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRevenueChartData = (query?: ChartQuery) => {
  return useQuery({
    queryKey: ['revenue', 'chart', query?.chartType, query?.period, query?.granularity],
    queryFn: () => analyticsApi.getRevenueChartData(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// User Analytics Hooks
export const useUserAnalytics = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['users', 'analytics', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getUserAnalytics(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUserBehavior = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['users', 'behavior', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getUserBehavior(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Analytics Hooks
export const useProviderAnalytics = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['providers', 'analytics', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getProviderAnalytics(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProviderServices = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['providers', 'services', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getProviderServices(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Booking Analytics Hooks
export const useBookingAnalytics = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['bookings', 'analytics', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getBookingAnalytics(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBookingConversion = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['bookings', 'conversion', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getBookingConversion(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Review Analytics Hooks
export const useReviewAnalytics = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['reviews', 'analytics', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getReviewAnalytics(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useReviewSentiment = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['reviews', 'sentiment', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getReviewSentiment(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Support Analytics Hooks
export const useSupportAnalytics = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['support', 'analytics', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getSupportAnalytics(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSupportPerformance = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['support', 'performance', query?.period || '30d', query?.compare],
    queryFn: () => analyticsApi.getSupportPerformance(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Chart Data Hook
export const useChartData = (query: ChartQuery) => {
  return useQuery({
    queryKey: ['chart', query.chartType, query.period, query.granularity],
    queryFn: () => analyticsApi.getRevenueChartData(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Real-time Updates Hook
export const useRealtimeUpdates = () => {
  return useQuery({
    queryKey: ['realtime', 'updates'],
    queryFn: () => analyticsApi.getRealtimeUpdates(),
    select: (response) => response.data,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1 minute
  });
};

// Error Handling Hook
export const useAnalyticsError = (errorKey: string) => {
  return useQuery({
    queryKey: ['analytics', 'error', errorKey],
    queryFn: () => Promise.reject(new Error('Analytics error occurred')),
    enabled: false, // Disabled by default, enable when needed
  });
};