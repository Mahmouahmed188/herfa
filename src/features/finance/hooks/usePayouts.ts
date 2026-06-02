import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../services/api';
import { toast } from 'sonner';

export function usePayoutRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
  query?: string;
}) {
  return useQuery({
    queryKey: ['finance', 'payouts', params],
    queryFn: () => financeApi.getPayoutRequests(params),
  });
}

export function useProcessPayouts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: financeApi.processPayouts,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'payouts'] });
      toast.success(`${variables.payoutIds.length} payout(s) ${variables.action.toLowerCase()}ed`);
    },
  });
}

export function useRevenueStats(range?: string) {
  return useQuery({
    queryKey: ['finance', 'stats', 'revenue', range],
    queryFn: () => financeApi.getRevenueStats({ range }),
  });
}
