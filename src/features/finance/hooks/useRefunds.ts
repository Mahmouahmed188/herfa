import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../services/api';
import { toast } from 'sonner';
import { CreateRefundInput } from '../schemas/refunds';

export function useRefunds(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  // Assuming a generic getRefunds exists in financeApi or derived from payments
  return useQuery({
    queryKey: ['finance', 'refunds', params],
    queryFn: () => financeApi.getPayments({ ...params, status: 'REFUNDED' }), // Fallback for list
  });
}

export function useIssueRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateRefundInput }) => 
      financeApi.issueRefund(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      toast.success('Refund issued successfully');
    },
    onError: (error: any) => {
      toast.error(error.error?.message || 'Failed to issue refund');
    },
  });
}
