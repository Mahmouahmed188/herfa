import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../services/api';
import { toast } from 'sonner';
import { ProcessPaymentInput } from '../schemas/payments';

export function usePayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: ['finance', 'payments', 'customer', params],
    queryFn: () => financeApi.getPayments(params),
  });
}

export function useProviderPayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ['finance', 'payments', 'provider', params],
    queryFn: () => financeApi.getProviderPayments(params),
  });
}

export function usePaymentDetails(id: string) {
  return useQuery({
    queryKey: ['finance', 'payments', 'detail', id],
    queryFn: () => financeApi.getPaymentDetails(id),
    enabled: !!id,
  });
}

export function useProcessPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessPaymentInput }) => 
      financeApi.processPayment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'payments'] });
      toast.success('Payment processed successfully');
    },
  });
}

export function useProviderEarnings() {
  return useQuery({
    queryKey: ['finance', 'earnings', 'provider'],
    queryFn: () => financeApi.getProviderEarnings(),
  });
}
