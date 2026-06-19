import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { verificationApi } from '../services/api';
import type { 
  Verification, 
  VerificationDetail, 
  VerificationListQuery, 
  VerificationListResponse,
  VerificationStatusUpdate,
  VerificationStats,
  VerificationWorkflow,
  ProviderVerification,
  UserVerification
} from '../types';

// Verification Management Hooks
export const useVerifications = (query: VerificationListQuery) => {
  return useQuery({
    queryKey: ['verifications', query.page, query.limit, query.type, query.status, query.priority],
    queryFn: () => verificationApi.getVerifications(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useVerificationDetail = (verificationId: string) => {
  return useQuery({
    queryKey: ['verifications', verificationId, 'detail'],
    queryFn: () => verificationApi.getVerificationDetail(verificationId),
    select: (response) => response.data,
    enabled: !!verificationId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useVerificationStats = () => {
  return useQuery({
    queryKey: ['verifications', 'stats'],
    queryFn: () => verificationApi.getVerificationStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useVerificationWorkflow = () => {
  return useQuery({
    queryKey: ['verifications', 'workflow'],
    queryFn: () => verificationApi.getVerificationWorkflow(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Verification Hooks
export const useProviderVerifications = (query: VerificationListQuery) => {
  return useQuery({
    queryKey: ['providers', 'verifications', query.page, query.limit, query.status],
    queryFn: () => verificationApi.getProviderVerifications(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProviderVerificationDetail = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'verification'],
    queryFn: () => verificationApi.getProviderVerificationDetail(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProviderDocuments = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'documents'],
    queryFn: () => verificationApi.getProviderDocuments(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// User Verification Hooks
export const useUserVerifications = (query: VerificationListQuery) => {
  return useQuery({
    queryKey: ['users', 'verifications', query.page, query.limit, query.status],
    queryFn: () => verificationApi.getUserVerifications(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUserVerificationDetail = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'verification'],
    queryFn: () => verificationApi.getUserVerificationDetail(userId),
    select: (response) => response.data,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Document Verification Hooks
export const useDocumentVerifications = (query: VerificationListQuery) => {
  return useQuery({
    queryKey: ['documents', 'verifications', query.page, query.limit, query.status],
    queryFn: () => verificationApi.getDocumentVerifications(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDocumentVerificationDetail = (documentId: string) => {
  return useQuery({
    queryKey: ['documents', documentId, 'verification'],
    queryFn: () => verificationApi.getDocumentVerificationDetail(documentId),
    select: (response) => response.data,
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Background Check Hooks
export const useBackgroundChecks = (query: VerificationListQuery) => {
  return useQuery({
    queryKey: ['background-checks', query.page, query.limit, query.status],
    queryFn: () => verificationApi.getBackgroundChecks(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBackgroundCheckDetail = (checkId: string) => {
  return useQuery({
    queryKey: ['background-checks', checkId, 'detail'],
    queryFn: () => verificationApi.getBackgroundCheckDetail(checkId),
    select: (response) => response.data,
    enabled: !!checkId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Verification Queue Hooks
export const useVerificationQueue = (type?: 'provider' | 'user' | 'document') => {
  return useQuery({
    queryKey: ['verifications', 'queue', type],
    queryFn: () => verificationApi.getVerificationQueue(type),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useVerificationQueueStats = () => {
  return useQuery({
    queryKey: ['verifications', 'queue', 'stats'],
    queryFn: () => verificationApi.getVerificationQueueStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Performance Metrics Hooks
export const useVerificationPerformance = () => {
  return useQuery({
    queryKey: ['verifications', 'performance'],
    queryFn: () => verificationApi.getVerificationPerformance(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useVerificationAnalytics = (period = '30d') => {
  return useQuery({
    queryKey: ['verifications', 'analytics', period],
    queryFn: () => verificationApi.getVerificationAnalytics(period),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const updateVerificationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ verificationId, data }: { verificationId: string; data: VerificationStatusUpdate }) => 
      verificationApi.updateVerificationStatus(verificationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] });
      queryClient.invalidateQueries({ queryKey: ['verifications', 'stats'] });
    },
  });
};

export const verifyProvider = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string; data: ProviderVerification }) => 
      verificationApi.verifyProvider(providerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers', 'verifications'] });
      queryClient.invalidateQueries({ queryKey: ['verifications', 'stats'] });
    },
  });
};

export const rejectProvider = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string; data: ProviderVerification }) => 
      verificationApi.rejectProvider(providerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers', 'verifications'] });
      queryClient.invalidateQueries({ queryKey: ['verifications', 'stats'] });
    },
  });
};

export const verifyUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserVerification }) => 
      verificationApi.verifyUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'verifications'] });
      queryClient.invalidateQueries({ queryKey: ['verifications', 'stats'] });
    },
  });
};

export const bulkUpdateVerifications = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Array<{ verificationId: string; action: 'approve' | 'reject' | 'pending'; reason?: string }>) => 
      verificationApi.bulkUpdateVerifications(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] });
      queryClient.invalidateQueries({ queryKey: ['verifications', 'stats'] });
    },
  });
};

// Search Hooks
export const useSearchVerifications = (filters: {
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  dateRange?: string;
  userId?: string;
  providerId?: string;
}) => {
  return useQuery({
    queryKey: ['verifications', 'search', filters],
    queryFn: () => verificationApi.searchVerifications(filters),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Export Hooks
export const useExportVerifications = () => {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'json'; filters?: any }) => 
      verificationApi.exportVerifications(format, filters),
  });
};

// Real-time Updates Hook
export const useRealtimeVerificationUpdates = () => {
  return useQuery({
    queryKey: ['verifications', 'realtime'],
    queryFn: () => Promise.resolve({ updates: [] }), // Placeholder - implement WebSocket connection
    select: (response) => response.updates,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1 minute
  });
};