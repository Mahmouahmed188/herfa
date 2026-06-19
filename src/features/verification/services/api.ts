import { api } from '@/lib/axios';
import { VerificationSchemas } from '../schemas';
import type { 
  Verification,
  VerificationDetail,
  PendingVerificationListResponse,
  VerificationAction,
  VerificationApproval,
  VerificationRejection
} from '../types';

export const verificationApi = {
  /**
   * Get pending verification requests
   */
  getPendingVerifications: async (page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get('/admin/verification/pending', { params });
    return VerificationSchemas.pendingListResponse.parse(response.data);
  },

  /**
   * Get detailed verification information
   */
  getVerificationDetail: async (verificationId: string) => {
    const response = await api.get(`/admin/verification/${verificationId}`);
    return VerificationSchemas.detail.parse(response.data);
  },

  /**
   * Approve a verification request
   */
  approveVerification: async (verificationId: string, data: VerificationApproval) => {
    const response = await api.post(`/admin/verification/${verificationId}/approve`, data);
    return response.data;
  },

  /**
   * Reject a verification request
   */
  rejectVerification: async (verificationId: string, data: VerificationRejection) => {
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
    notes?: string;
  }>) => {
    const response = await api.post('/admin/verification/bulk', { verifications });
    return response.data;
  },

  /**
   * Get verification by provider
   */
  getProviderVerification: async (providerId: string) => {
    const response = await api.get(`/admin/verification/provider/${providerId}`);
    return response.data;
  },

  /**
   * Get verification history
   */
  getVerificationHistory: async (verificationId: string) => {
    const response = await api.get(`/admin/verification/${verificationId}/history`);
    return response.data;
  },

  /**
   * Get verification document types
   */
  getDocumentTypes: async () => {
    const response = await api.get('/admin/verification/document-types');
    return response.data;
  },

  /**
   * Upload verification document
   */
  uploadDocument: async (verificationId: string, formData: FormData) => {
    const response = await api.post(`/admin/verification/${verificationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update document status
   */
  updateDocumentStatus: async (documentId: string, data: {
    status: 'approved' | 'rejected';
    reason?: string;
    notes?: string;
  }) => {
    const response = await api.post(`/admin/verification/documents/${documentId}/status`, data);
    return response.data;
  },

  /**
   * Get verification templates
   */
  getVerificationTemplates: async () => {
    const response = await api.get('/admin/verification/templates');
    return response.data;
  },

  /**
   * Create verification template
   */
  createVerificationTemplate: async (data: {
    name: string;
    description: string;
    documentTypes: Array<{
      type: string;
      required: boolean;
      maxSize: number;
      allowedTypes: string[];
    }>;
    requirements: string[];
  }) => {
    const response = await api.post('/admin/verification/templates', data);
    return response.data;
  },

  /**
   * Export verification data
   */
  exportVerifications: async (format: 'csv' | 'excel' | 'json', filters?: any) => {
    const params = { format, ...filters };
    const response = await api.get('/admin/verification/export', { params });
    return response.data;
  },

  /**
   * Get verification workflow status
   */
  getWorkflowStatus: async (verificationId: string) => {
    const response = await api.get(`/admin/verification/${verificationId}/workflow`);
    return response.data;
  },

  /**
   * Resubmit verification
   */
  resubmitVerification: async (verificationId: string, data: {
    notes?: string;
  }) => {
    const response = await api.post(`/admin/verification/${verificationId}/resubmit`, data);
    return response.data;
  },
};