import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../services/api';

export function useAnalyticsOverview(period?: string) {
  return useQuery({
    queryKey: ['analytics', 'overview', period],
    queryFn: () => analyticsApi.getOverview(period),
  });
}

export function useRevenueChart(period?: string) {
  return useQuery({
    queryKey: ['analytics', 'revenue', period],
    queryFn: () => analyticsApi.getRevenueChart(period),
  });
}

export function useBookingChart(period?: string) {
  return useQuery({
    queryKey: ['analytics', 'bookings', period],
    queryFn: () => analyticsApi.getBookingChart(period),
  });
}

export function useConversionFunnel() {
  return useQuery({
    queryKey: ['analytics', 'conversion'],
    queryFn: () => analyticsApi.getConversionFunnel(),
  });
}

export function useRetentionReport() {
  return useQuery({
    queryKey: ['analytics', 'retention'],
    queryFn: () => analyticsApi.getRetentionReport(),
  });
}
