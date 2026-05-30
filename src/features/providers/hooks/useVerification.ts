import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerApi } from '../services/api';
import { toast } from 'sonner';

/**
 * TanStack Query hooks for provider verification.
 * Aligns with the "Server-State Dominance" principle.
 */

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
