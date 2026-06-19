import { api } from '@/lib/axios';
import { ProviderSchemas } from '../schemas';
import type { 
  Provider, 
  ProviderDetail, 
  ProviderListQuery, 
  ProviderListResponse,
  ProviderStatusUpdate,
  PendingVerificationListResponse,
  VerificationAction,
  TopProvider 
} from '../types';

// Types for provider api
export interface SubmitVerificationData {
  documents: Array<{ type: string; file: File | string }>;
  notes?: string;
}

export interface UploadProgressCallback {
  onProgress?: (percent: number) => void;
}

export const providersApi = {
  /**
   * Get paginated list of providers
   */
  getProviders: async (query: ProviderListQuery) => {
    const params = {
      page: query.page,
      limit: query.limit,
      ...(query.search && { search: query.search }),
      ...(query.status && { status: query.status }),
      ...(query.category && { category: query.category }),
    };

    const response = await api.get('/admin/providers', { params });
    return ProviderSchemas.listResponse.parse(response.data);
  },

  /**
   * Get detailed provider information
   */
  getProviderDetail: async (providerId: string) => {
    const response = await api.get(`/admin/providers/${providerId}`);
    return ProviderSchemas.detail.parse(response.data);
  },

  /**
   * Approve a provider application
   */
  approveProvider: async (providerId: string, data: ProviderStatusUpdate) => {
    const response = await api.post(`/admin/providers/${providerId}/approve`, data);
    return response.data;
  },

  /**
   * Suspend a provider account
   */
  suspendProvider: async (providerId: string, data: ProviderStatusUpdate) => {
    const response = await api.post(`/admin/providers/${providerId}/suspend`, data);
    return response.data;
  },

  /**
   * Reactivate a suspended provider account
   */
  reactivateProvider: async (providerId: string, data: ProviderStatusUpdate) => {
    const response = await api.post(`/admin/providers/${providerId}/reactivate`, data);
    return response.data;
  },

  /**
   * Get provider statistics
   */
  getProviderStats: async () => {
    const response = await api.get('/admin/providers/stats');
    return response.data;
  },

  /**
   * Get top performing providers
   */
  getTopProviders: async (limit = 10) => {
    const params = { limit };
    const response = await api.get('/admin/providers/top', { params });
    return response.data;
  },

  /**
   * Get provider services
   */
  getProviderServices: async (providerId: string) => {
    const response = await api.get(`/admin/providers/${providerId}/services`);
    return response.data;
  },

  /**
   * Get provider reviews
   */
  getProviderReviews: async (providerId: string, page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get(`/admin/providers/${providerId}/reviews`, { params });
    return response.data;
  },

  /**
   * Get provider earnings
   */
  getProviderEarnings: async (providerId: string, period = '30d') => {
    const params = { period };
    const response = await api.get(`/admin/providers/${providerId}/earnings`, { params });
    return response.data;
  },

  /**
   * Get provider availability
   */
  getProviderAvailability: async (providerId: string) => {
    const response = await api.get(`/admin/providers/${providerId}/availability`);
    return response.data;
  },

  /**
   * Search providers with advanced filters
   */
  searchProviders: async (filters: {
    search?: string;
    status?: string;
    category?: string;
    rating?: number;
    registrationDate?: string;
  }) => {
    const params = { ...filters };
    const response = await api.get('/admin/providers/search', { params });
    return response.data;
  },

  /**
   * Export provider data
   */
  exportProviders: async (format: 'csv' | 'excel' | 'json', filters?: any) => {
    const params = { format, ...filters };
    const response = await api.get('/admin/providers/export', { params });
    return response.data;
  },

  /**
   * Update provider status (generic)
   */
  updateProviderStatus: async (providerId: string, data: ProviderStatusUpdate) => {
    const response = await api.patch(`/admin/providers/${providerId}/status`, data);
    return response.data;
  },

  /**
   * Bulk update providers
   */
  bulkUpdateProviders: async (updates: Array<{ providerId: string; action: 'verify' | 'reject' | 'suspend'; reason?: string }>) => {
    const response = await api.post('/admin/providers/bulk-update', { updates });
    return response.data;
  },
};

// Verification API
export const verificationApi = {
  /**
   * Get pending verification requests
   */
  getPendingVerifications: async (page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get('/admin/verification/pending', { params });
    return ProviderSchemas.verificationListResponse.parse(response.data);
  },

  /**
   * Get detailed verification information
   */
  getVerificationDetail: async (verificationId: string) => {
    const response = await api.get(`/admin/verification/${verificationId}`);
    return ProviderSchemas.verification.parse(response.data);
  },

  /**
   * Approve a verification request
   */
  approveVerification: async (verificationId: string, data: VerificationAction) => {
    const response = await api.post(`/admin/verification/${verificationId}/approve`, data);
    return response.data;
  },

  /**
   * Reject a verification request
   */
  rejectVerification: async (verificationId: string, data: VerificationAction) => {
    const response = await api.post(`/admin/verification/${verificationId}/reject`, data);
    return response.data;
  },

  /**
   * Get verification statistics
   */
  getVerificationStats: async () => {
    const response = await api.get('/admin/verification/stats');
    return response.data;
  },

  /**
   * Get document verification status
   */
  getDocumentVerification: async (documentId: string) => {
    const response = await api.get(`/admin/verification/documents/${documentId}`);
    return response.data;
  },

  /**
   * Bulk verification operations
   */
  bulkVerify: async (verifications: Array<{
    verificationId: string;
    action: 'approve' | 'reject';
    reason?: string;
  }>) => {
    const response = await api.post('/admin/verification/bulk', { verifications });
    return response.data;
  },

  /**
   * Submit verification documents (provider-facing)
   */
  submitVerification: async (data: { providerId?: string; documents: Array<{ type: string; file: string }> }) => {
    const response = await api.post('/admin/verification/submit', data);
    return response.data;
  },

  /**
   * Get current verification status
   */
  getVerificationStatus: async () => {
    const response = await api.get('/admin/verification/status');
    return response.data;
  },

  /**
   * Get verification history
   */
  getVerificationHistory: async () => {
    const response = await api.get('/admin/verification/history');
    return response.data;
  },

  /**
   * Upload a file with progress tracking
   */
  uploadFile: async (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/verification/upload', formData, {
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
};

/**
 * Unified provider API combining providers and verification endpoints.
 * This is the primary import target for most provider-related hooks.
 */
export const providerApi = {
  ...providersApi,
  ...verificationApi,

  // Explicit overrides and aliases for hook compatibility
  submitVerification: verificationApi.submitVerification,
  getVerificationStatus: verificationApi.getVerificationStatus,
  getVerificationHistory: verificationApi.getVerificationHistory,
  uploadFile: verificationApi.uploadFile,
  getVerificationQueue: verificationApi.getPendingVerifications,
  getVerificationDetails: verificationApi.getVerificationDetail,
  rejectProvider: verificationApi.rejectVerification,
  updateProviderStatus: providersApi.updateProviderStatus,
};