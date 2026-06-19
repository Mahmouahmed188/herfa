import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providersApi } from '../services/api';
import type { 
  Provider, 
  ProviderDetail, 
  ProviderListQuery, 
  ProviderListResponse,
  ProviderVerification,
  ProviderStatusUpdate,
  ProviderPerformance
} from '../types';

// Provider List Hook
export const useProviders = (query: ProviderListQuery) => {
  return useQuery({
    queryKey: ['providers', query.page, query.limit, query.search, query.status, query.verificationStatus],
    queryFn: () => providersApi.getProviders(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Provider Detail Hook
export const useProviderDetail = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'detail'],
    queryFn: () => providersApi.getProviderDetail(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Statistics Hook
export const useProviderStats = () => {
  return useQuery({
    queryKey: ['providers', 'stats'],
    queryFn: () => providersApi.getProviderStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Verification Hook
export const useProviderVerification = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'verification'],
    queryFn: () => providersApi.getProviderVerification(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Performance Hook
export const useProviderPerformance = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'performance'],
    queryFn: () => providersApi.getProviderPerformance(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Bookings Hook
export const useProviderBookings = (providerId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['providers', providerId, 'bookings', page, limit],
    queryFn: () => providersApi.getProviderBookings(providerId, page, limit),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Reviews Hook
export const useProviderReviews = (providerId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['providers', providerId, 'reviews', page, limit],
    queryFn: () => providersApi.getProviderReviews(providerId, page, limit),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Services Hook
export const useProviderServices = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'services'],
    queryFn: () => providersApi.getProviderServices(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Documents Hook
export const useProviderDocuments = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'documents'],
    queryFn: () => providersApi.getProviderDocuments(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Provider Financials Hook
export const useProviderFinancials = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'financials'],
    queryFn: () => providersApi.getProviderFinancials(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const useVerifyProvider = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string; data: ProviderVerification }) => 
      providersApi.verifyProvider(providerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'stats'] });
    },
  });
};

export const useRejectProvider = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string; data: ProviderVerification }) => 
      providersApi.rejectProvider(providerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'stats'] });
    },
  });
};

export const useUpdateProviderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: string; data: ProviderStatusUpdate }) => 
      providersApi.updateProviderStatus(providerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', providerId] });
    },
  });
};

export const useBulkUpdateProviders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Array<{ providerId: string; action: 'verify' | 'reject' | 'suspend'; reason?: string }>) => 
      providersApi.bulkUpdateProviders(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'stats'] });
    },
  });
};

// Search Providers Hook
export const useSearchProviders = (filters: {
  search?: string;
  status?: string;
  verificationStatus?: string;
  serviceType?: string;
  registrationDate?: string;
}) => {
  return useQuery({
    queryKey: ['providers', 'search', filters],
    queryFn: () => providersApi.searchProviders(filters),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Export Providers Hook
export const useExportProviders = () => {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'json'; filters?: any }) => 
      providersApi.exportProviders(format, filters),
  });
};

// Provider Performance Metrics Hook
export const useProviderPerformanceMetrics = (providerId: string) => {
  return useQuery({
    queryKey: ['providers', providerId, 'performance-metrics'],
    queryFn: () => providersApi.getProviderPerformanceMetrics(providerId),
    select: (response) => response.data,
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Real-time Provider Updates Hook
export const useRealtimeProviderUpdates = () => {
  return useQuery({
    queryKey: ['providers', 'realtime'],
    queryFn: () => Promise.resolve({ updates: [] }), // Placeholder - implement WebSocket connection
    select: (response) => response.updates,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1 minute
  });
};