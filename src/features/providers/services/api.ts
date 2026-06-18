import { api } from '@/lib/axios';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { 
  ProviderVerification, 
  VerificationHistoryEvent,
  ApproveProviderInput, 
  RejectProviderInput 
} from '../schemas/verification';

/**
 * Provider API service for verification workflows.
 * Aligns with the "Admin Dashboard Architecture" standards.
 */
export const providerApi = {
  // --- Provider-facing endpoints ---

  submitVerification: async (data: {
    frontIdImage: string;
    backIdImage: string;
    personalPhoto: string;
    documents: string[];
    portfolio: string[];
  }) => {
    const response = await api.post<ApiResponse<{
      id: string;
      status: string;
      submittedAt: string;
    }>>('/verification/submit', data);
    return response.data;
  },

  getVerificationStatus: async () => {
    const response = await api.get<ApiResponse<ProviderVerification>>('/verification/status');
    return response.data;
  },

  getVerificationHistory: async () => {
    const response = await api.get<ApiResponse<VerificationHistoryEvent[]>>('/verification/history');
    return response.data;
  },

  uploadFile: async (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ url: string }>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  // --- Admin endpoints ---

  getVerificationQueue: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
  }) => {
    const response = await api.get<PaginatedResponse<ProviderVerification>>(
      '/admin/provider-verifications',
      { params }
    );
    return response.data;
  },

  getVerificationDetails: async (id: string) => {
    const response = await api.get<ApiResponse<ProviderVerification>>(
      `/admin/provider-verifications/${id}`
    );
    return response.data;
  },

  approveProvider: async (data: ApproveProviderInput) => {
    const response = await api.patch<ApiResponse<any>>(
      `/admin/provider-verifications/${data.providerId}/approve`,
      data
    );
    return response.data;
  },

  rejectProvider: async (data: RejectProviderInput) => {
    const response = await api.patch<ApiResponse<any>>(
      `/admin/provider-verifications/${data.providerId}/reject`,
      data
    );
    return response.data;
  },

  getProviders: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
    status?: string;
  }) => {
    const response = await api.get<PaginatedResponse<any>>(
      '/providers',
      { params }
    );
    return response.data;
  },

  updateProviderStatus: async (id: string, status: string, reason: string) => {
    const response = await api.post<ApiResponse<any>>(`/providers/${id}/status`, {
      status,
      reason,
    });
    return response.data;
  },
};
