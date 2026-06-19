import { useQuery } from '@tanstack/react-query';
import { financeApi } from '../services/api';
import type { PaymentQuery } from '../types';

export const usePayments = (query: PaymentQuery) => {
  return useQuery({
    queryKey: ['payments', query.page, query.limit, query.status, query.method],
    queryFn: () => financeApi.getPayments(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePaymentDetail = (paymentId: string) => {
  return useQuery({
    queryKey: ['payments', paymentId, 'detail'],
    queryFn: () => financeApi.getPaymentDetail(paymentId),
    select: (response) => response.data,
    enabled: !!paymentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePaymentOverview = () => {
  return useQuery({
    queryKey: ['payments', 'overview'],
    queryFn: () => financeApi.getPaymentsOverview(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePaymentStats = () => {
  return useQuery({
    queryKey: ['payments', 'stats'],
    queryFn: () => financeApi.getPaymentStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProviderEarnings = () => {
  return useQuery({
    queryKey: ['provider', 'earnings'],
    queryFn: () => financeApi.getProviderEarnings(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProviderPayments = (query: { page?: number; limit?: number; status?: string } = {}) => {
  return useQuery({
    queryKey: ['provider', 'payments', query.page, query.limit, query.status],
    queryFn: () => financeApi.getProviderPayments(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
