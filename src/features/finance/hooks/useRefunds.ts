import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../services/api';
import type { RefundQuery, RefundApproval, RefundRejection } from '../types';

export const useRefunds = (query: RefundQuery) => {
  return useQuery({
    queryKey: ['refunds', query.page, query.limit, query.status],
    queryFn: () => financeApi.getRefunds(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRefundDetail = (refundId: string) => {
  return useQuery({
    queryKey: ['refunds', refundId, 'detail'],
    queryFn: () => financeApi.getRefundDetail(refundId),
    select: (response) => response.data,
    enabled: !!refundId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRefundStats = () => {
  return useQuery({
    queryKey: ['refunds', 'stats'],
    queryFn: () => financeApi.getRefundStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useApproveRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ refundId, data }: { refundId: string; data: RefundApproval }) =>
      financeApi.approveRefund(refundId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
};

export const useRejectRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ refundId, data }: { refundId: string; data: RefundRejection }) =>
      financeApi.rejectRefund(refundId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
};
