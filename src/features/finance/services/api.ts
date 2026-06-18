import { api } from '@/lib/axios';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { 
  PayoutRequest, 
  ProcessPayoutInput 
} from '../schemas/payouts';
import { Payment, Refund, FinancialSummary } from '../types';
import { ProcessPaymentInput } from '../schemas/payments';
import { CreateRefundInput } from '../schemas/refunds';

export const financeApi = {
  // Payouts (Admin/Provider)
  getPayoutRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    query?: string;
  }) => {
    const response = await api.get<PaginatedResponse<PayoutRequest>>(
      '/finance/payouts',
      { params }
    );
    return response.data;
  },

  processPayouts: async (data: ProcessPayoutInput) => {
    const response = await api.post<ApiResponse<any>>(
      '/finance/payouts/process',
      data
    );
    return response.data;
  },

  // Payments (Customer)
  getPayments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const response = await api.get<PaginatedResponse<Payment>>(
      '/payments',
      { params }
    );
    return response.data;
  },

  // Payments (Provider)
  getProviderPayments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await api.get<PaginatedResponse<Payment>>(
      '/payments/provider',
      { params }
    );
    return response.data;
  },

  // Payment Details
  getPaymentDetails: async (id: string) => {
    const response = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
    return response.data;
  },

  // Process Payment
  processPayment: async (id: string, data: ProcessPaymentInput) => {
    const response = await api.post<ApiResponse<{ status: string; transactionId: string }>>(
      `/payments/${id}/process`,
      data
    );
    return response.data;
  },

  // Refunds (Admin)
  issueRefund: async (id: string, data: CreateRefundInput) => {
    const response = await api.post<ApiResponse<Refund>>(
      `/payments/admin/${id}/refund`,
      data
    );
    return response.data;
  },

  // Stats & Dashboards
  getRevenueStats: async (params?: { range?: string }) => {
    const response = await api.get<ApiResponse<any>>(
      '/admin/dashboard/revenue',
      { params }
    );
    return response.data;
  },

  getProviderEarnings: async () => {
    // Assuming this endpoint exists or can be derived
    const response = await api.get<ApiResponse<FinancialSummary>>('/finance/earnings');
    return response.data;
  },
};
