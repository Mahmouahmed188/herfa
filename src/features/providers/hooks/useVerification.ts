import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerApi } from '../services/api';
import { toast } from 'sonner';

/**
 * TanStack Query hooks for provider verification.
 * Aligns with the "Server-State Dominance" principle.
 */

// --- Provider-facing hooks ---

export function useSubmitVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.submitVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'verification'] });
      toast.success('Verification submitted successfully');
    },
  });
}

export function useVerificationStatus() {
  return useQuery({
    queryKey: ['verificationStatus'],
    queryFn: () => providerApi.getVerificationStatus(),
    retry: false,
  });
}

export function useVerificationHistory() {
  return useQuery({
    queryKey: ['verificationHistory'],
    queryFn: () => providerApi.getVerificationHistory(),
    retry: false,
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: (params: { file: File; onProgress?: (percent: number) => void }) =>
      providerApi.uploadFile(params.file, params.onProgress),
  });
}

// --- Admin hooks ---

export function useVerificationQueue(params?: {
  page?: number;
  limit?: number;
  query?: string;
}) {
  return useQuery({
    queryKey: ['providers', 'verification-queue', params],
    queryFn: () => providerApi.getVerificationQueue(params),
  });
}

export function useVerificationDetails(id: string) {
  return useQuery({
    queryKey: ['providers', 'verification', id],
    queryFn: () => providerApi.getVerificationDetails(id),
    enabled: !!id,
  });
}

export function useApproveProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.approveProvider,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['providers', 'verification-queue'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'verification', variables.providerId] });
      toast.success('Provider approved successfully');
    },
  });
}

export function useRejectProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.rejectProvider,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['providers', 'verification-queue'] });
      queryClient.invalidateQueries({ queryKey: ['providers', 'verification', variables.providerId] });
      toast.warning('Provider rejected');
    },
  });
}

export function useProviders(params?: {
  page?: number;
  limit?: number;
  query?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['providers', 'list', params],
    queryFn: () => providerApi.getProviders(params),
  });
}

export function useUpdateProviderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; status: string; reason: string }) =>
      providerApi.updateProviderStatus(data.id, data.status, data.reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast.success(`Provider status updated to ${variables.status.toLowerCase()}`);
    },
  });
}
