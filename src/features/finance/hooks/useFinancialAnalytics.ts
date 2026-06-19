import { useQuery } from '@tanstack/react-query';
import { financeApi } from '../services/api';

export const useFinancialDashboard = (period = '30d') => {
  return useQuery({
    queryKey: ['finance', 'dashboard', period],
    queryFn: () => financeApi.getFinancialDashboard(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRevenueByService = (period = '30d') => {
  return useQuery({
    queryKey: ['finance', 'revenue-by-service', period],
    queryFn: () => financeApi.getRevenueByService(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRevenueByProvider = (period = '30d') => {
  return useQuery({
    queryKey: ['finance', 'revenue-by-provider', period],
    queryFn: () => financeApi.getRevenueByProvider(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFinancialAnalytics = (period = '30d') => {
  return useQuery({
    queryKey: ['finance', 'analytics', period],
    queryFn: () => financeApi.getFinancialAnalytics(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTransactionHistory = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['finance', 'transactions', page, limit],
    queryFn: () => financeApi.getTransactionHistory(page, limit),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
