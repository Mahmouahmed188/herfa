import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../services/api';
import { toast } from 'sonner';

export function useBroadcasts(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['notifications', 'broadcasts', params],
    queryFn: () => notificationsApi.getBroadcasts(params),
  });
}

export function useSendBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.sendBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'broadcasts'] });
      toast.success('Broadcast sent successfully');
    },
  });
}
