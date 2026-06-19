import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import type { AnalyticsQuery } from '../types';

// Dashboard Overview Hooks
export const useDashboardOverview = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['dashboard', 'overview', query?.period || '30d', query?.compare],
    queryFn: () => dashboardApi.getDashboardOverview(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['dashboard', 'system-health'],
    queryFn: () => dashboardApi.getSystemHealth(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRecentActivity = (limit = 20) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity', limit],
    queryFn: () => dashboardApi.getRecentActivity(limit),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePlatformOverview = () => {
  return useQuery({
    queryKey: ['dashboard', 'platform-overview'],
    queryFn: () => dashboardApi.getPlatformOverview(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBusinessMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'business-metrics'],
    queryFn: () => dashboardApi.getBusinessMetrics(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGrowthMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'growth-metrics'],
    queryFn: () => dashboardApi.getGrowthMetrics(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useActivityMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'activity-metrics'],
    queryFn: () => dashboardApi.getActivityMetrics(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Real-time Updates Hook
export const useRealtimeUpdates = () => {
  return useQuery({
    queryKey: ['dashboard', 'realtime-updates'],
    queryFn: () => dashboardApi.getRealtimeUpdates(),
    select: (response) => response.data,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1 minute
  });
};

// Dashboard Configuration Hooks
export const useDashboardWidgets = () => {
  return useQuery({
    queryKey: ['dashboard', 'widgets'],
    queryFn: () => dashboardApi.getDashboardWidgets(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDashboardLayout = () => {
  return useQuery({
    queryKey: ['dashboard', 'layout'],
    queryFn: () => dashboardApi.getDashboardLayout(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDashboardTemplates = () => {
  return useQuery({
    queryKey: ['dashboard', 'templates'],
    queryFn: () => dashboardApi.getDashboardTemplates(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Dashboard Mutations
export const useUpdateDashboardWidgets = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (widgets: Record<string, unknown>[]) => dashboardApi.updateDashboardWidgets(widgets),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'widgets'] });
    },
  });
};

export const useSaveDashboardLayout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (layout: Record<string, unknown>) => dashboardApi.saveDashboardLayout(layout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'layout'] });
    },
  });
};

export const useCreateDashboardTemplate = () => {
  return useMutation({
    mutationFn: (template: {
      name: string;
      description: string;
      layout: Record<string, unknown>;
      widgets: Record<string, unknown>[];
    }) => dashboardApi.createDashboardTemplate(template),
  });
};

// Dashboard Export Hook
export const useExportDashboard = () => {
  return useMutation({
    mutationFn: ({ format, options }: { format: 'csv' | 'pdf' | 'excel'; options?: Record<string, unknown> }) => 
      dashboardApi.exportDashboard(format, options),
  });
};

// Dashboard Notifications Hook
export const useDashboardNotifications = () => {
  return useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: () => dashboardApi.getDashboardNotifications(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationIds: string[]) => 
      dashboardApi.markNotificationsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'notifications'] });
    },
  });
};

// Dashboard Performance Hook
export const useDashboardPerformance = () => {
  return useQuery({
    queryKey: ['dashboard', 'performance'],
    queryFn: () => dashboardApi.getDashboardPerformance(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Dashboard Error Logs Hook
export const useDashboardErrors = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['dashboard', 'errors', page, limit],
    queryFn: () => dashboardApi.getDashboardErrors(page, limit),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Domain-specific Dashboard Hooks
export const useUserEngagement = (period = '30d') => {
  return useQuery({
    queryKey: ['dashboard', 'user-engagement', period],
    queryFn: () => dashboardApi.getUserEngagement(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProviderPerformance = (period = '30d') => {
  return useQuery({
    queryKey: ['dashboard', 'provider-performance', period],
    queryFn: () => dashboardApi.getProviderPerformance(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBookingAnalytics = (period = '30d') => {
  return useQuery({
    queryKey: ['dashboard', 'booking-analytics', period],
    queryFn: () => dashboardApi.getBookingAnalytics(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRevenueAnalytics = (period = '30d') => {
  return useQuery({
    queryKey: ['dashboard', 'revenue-analytics', period],
    queryFn: () => dashboardApi.getRevenueAnalytics(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSupportAnalytics = (period = '30d') => {
  return useQuery({
    queryKey: ['dashboard', 'support-analytics', period],
    queryFn: () => dashboardApi.getSupportAnalytics(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// System Alerts Hook
export const useSystemAlerts = () => {
  return useQuery({
    queryKey: ['dashboard', 'system-alerts'],
    queryFn: () => dashboardApi.getSystemAlerts(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (alertId: string) => dashboardApi.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'system-alerts'] });
    },
  });
};