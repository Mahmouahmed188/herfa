import { api } from '@/lib/axios';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { 
  ProviderVerification, 
  ApproveProviderInput, 
  RejectProviderInput 
} from '../schemas/verification';

/**
 * Provider API service for verification workflows.
 * Aligns with the "Admin Dashboard Architecture" standards.
 */
export const providerApi = {
  getVerificationQueue: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
  }) => {
    const response = await api.get<PaginatedResponse<ProviderVerification>>(
      '/providers/verification',
      { params }
    );
    return response.data;
  },

  getVerificationDetails: async (id: string) => {
    const response = await api.get<ApiResponse<ProviderVerification>>(
      `/providers/verification/${id}`
    );
    return response.data;
  },

  approveProvider: async (data: ApproveProviderInput) => {
    const response = await api.post<ApiResponse<any>>(
      `/providers/verification/${data.providerId}/approve`,
      data
    );
    return response.data;
  },

  rejectProvider: async (data: RejectProviderInput) => {
    const response = await api.post<ApiResponse<any>>(
      `/providers/verification/${data.providerId}/reject`,
      data
    );
    return response.data;
  },
};
