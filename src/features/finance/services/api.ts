import { api } from '@/lib/axios';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { 
  PayoutRequest, 
  ProcessPayoutInput 
} from '../schemas/payouts';

export const financeApi = {
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

  getRevenueStats: async (params?: { range?: string }) => {
    const response = await api.get<ApiResponse<any>>(
      '/finance/stats/revenue',
      { params }
    );
    return response.data;
  },
};
