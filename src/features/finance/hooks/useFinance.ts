import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../services/api';
import type { 
  Payment, 
  PaymentDetail, 
  PaymentListQuery, 
  PaymentListResponse,
  Refund,
  RefundDetail,
  RefundListResponse,
  Transaction,
  TransactionDetail,
  TransactionListResponse,
  FinanceStats,
  RevenueAnalytics,
  Payout,
  PayoutDetail,
  PayoutListResponse,
  FinancialReport,
  TaxDocument
} from '../types';

// Payment Management Hooks
export const usePayments = (query: PaymentListQuery) => {
  return useQuery({
    queryKey: ['payments', query.page, query.limit, query.status, query.method, query.dateRange],
    queryFn: () => financeApi.getPayments(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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

export const usePaymentStats = () => {
  return useQuery({
    queryKey: ['payments', 'stats'],
    queryFn: () => financeApi.getPaymentStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Refund Management Hooks
export const useRefunds = (query: PaymentListQuery) => {
  return useQuery({
    queryKey: ['refunds', query.page, query.limit, query.status, query.reason, query.dateRange],
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

// Transaction Management Hooks
export const useTransactions = (query: PaymentListQuery) => {
  return useQuery({
    queryKey: ['transactions', query.page, query.limit, query.type, query.status, query.dateRange],
    queryFn: () => financeApi.getTransactions(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTransactionDetail = (transactionId: string) => {
  return useQuery({
    queryKey: ['transactions', transactionId, 'detail'],
    queryFn: () => financeApi.getTransactionDetail(transactionId),
    select: (response) => response.data,
    enabled: !!transactionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Payout Management Hooks
export const usePayouts = (query: PaymentListQuery) => {
  return useQuery({
    queryKey: ['payouts', query.page, query.limit, query.status, query.providerId, query.dateRange],
    queryFn: () => financeApi.getPayouts(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePayoutDetail = (payoutId: string) => {
  return useQuery({
    queryKey: ['payouts', payoutId, 'detail'],
    queryFn: () => financeApi.getPayoutDetail(payoutId),
    select: (response) => response.data,
    enabled: !!payoutId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Financial Analytics Hooks
export const useFinanceStats = () => {
  return useQuery({
    queryKey: ['finance', 'stats'],
    queryFn: () => financeApi.getFinanceStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useRevenueAnalytics = (period = '30d') => {
  return useQuery({
    queryKey: ['finance', 'revenue', period],
    queryFn: () => financeApi.getRevenueAnalytics(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePaymentMethodAnalytics = () => {
  return useQuery({
    queryKey: ['finance', 'payment-methods'],
    queryFn: () => financeApi.getPaymentMethodAnalytics(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Payout Hooks
export const useProviderPayouts = (providerId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['providers', providerId, 'payouts', page, limit],
    queryFn: () => financeApi.getProviderPayouts(providerId, page, limit),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProviderEarnings = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'earnings'],
    queryFn: () => financeApi.getProviderEarnings(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Financial Reports Hooks
export const useFinancialReports = (type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly') => {
  return useQuery({
    queryKey: ['finance', 'reports', type],
    queryFn: () => financeApi.getFinancialReports(type),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFinancialReportDetail = (reportId: string) => {
  return useQuery({
    queryKey: ['finance', 'reports', reportId, 'detail'],
    queryFn: () => financeApi.getFinancialReportDetail(reportId),
    select: (response) => response.data,
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Tax Documents Hooks
export const useTaxDocuments = () => {
  return useQuery({
    queryKey: ['finance', 'tax-documents'],
    queryFn: () => financeApi.getTaxDocuments(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTaxDocumentDetail = (documentId: string) => {
  return useQuery({
    queryKey: ['finance', 'tax-documents', documentId, 'detail'],
    queryFn: () => financeApi.getTaxDocumentDetail(documentId),
    select: (response) => response.data,
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Financial Health Hooks
export const useFinancialHealth = () => {
  return useQuery({
    queryKey: ['finance', 'health'],
    queryFn: () => financeApi.getFinancialHealth(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCashFlow = () => {
  return useQuery({
    queryKey: ['finance', 'cash-flow'],
    queryFn: () => financeApi.getCashFlow(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const updatePaymentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: string; data: { status: string; notes?: string } }) => 
      financeApi.updatePaymentStatus(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'stats'] });
    },
  });
};

export const processRefund = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ paymentId, data }: { paymentId: string; data: { amount: number; reason: string; notes?: string } }) => 
      financeApi.processRefund(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['finance', 'stats'] });
    },
  });
};

export const createPayout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { providerId: string; amount: number; method: string; notes?: string }) => 
      financeApi.createPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['finance', 'stats'] });
    },
  });
};

export const bulkUpdatePayments = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Array<{ paymentId: string; action: 'refund' | 'void' | 'capture'; amount?: number; reason?: string }>) => 
      financeApi.bulkUpdatePayments(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'stats'] });
    },
  });
};

export const generateFinancialReport = () => {
  return useMutation({
    mutationFn: (data: { type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'; dateRange: string; filters?: any }) => 
      financeApi.generateFinancialReport(data),
  });
};

// Search Hooks
export const useSearchPayments = (filters: {
  search?: string;
  status?: string;
  method?: string;
  dateRange?: string;
  userId?: string;
  providerId?: string;
  amount?: { min: number; max: number };
}) => {
  return useQuery({
    queryKey: ['payments', 'search', filters],
    queryFn: () => financeApi.searchPayments(filters),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSearchRefunds = (filters: {
  search?: string;
  status?: string;
  reason?: string;
  dateRange?: string;
  userId?: string;
  providerId?: string;
}) => {
  return useQuery({
    queryKey: ['refunds', 'search', filters],
    queryFn: () => financeApi.searchRefunds(filters),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Export Hooks
export const useExportPayments = () => {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'json'; filters?: any }) => 
      financeApi.exportPayments(format, filters),
  });
};

export const useExportRefunds = () => {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'json'; filters?: any }) => 
      financeApi.exportRefunds(format, filters),
  });
};

export const useExportTransactions = () => {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'json'; filters?: any }) => 
      financeApi.exportTransactions(format, filters),
  });
};

// Real-time Updates Hook
export const useRealtimeFinancialUpdates = () => {
  return useQuery({
    queryKey: ['finance', 'realtime'],
    queryFn: () => Promise.resolve({ updates: [] }), // Placeholder - implement WebSocket connection
    select: (response) => response.updates,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1 minute
  });
};