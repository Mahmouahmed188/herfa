import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, NotificationTemplate } from '../services/api';
import { toast } from 'sonner';

export function useBroadcasts(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['notifications', 'broadcasts', params],
    queryFn: () => notificationsApi.getBroadcasts(params),
    // The announcements endpoint may not be implemented on the backend yet.
    // Disable retries so a 404 doesn't flood the console.
    retry: false,
    // Don't refetch on window focus to avoid repeated 404 noise.
    refetchOnWindowFocus: false,
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

export function useTemplates() {
  return useQuery({
    queryKey: ['notifications', 'templates'],
    queryFn: () => notificationsApi.getTemplates(),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'templates'] });
      toast.success('Template created');
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NotificationTemplate> }) =>
      notificationsApi.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'templates'] });
      toast.success('Template updated');
    },
  });
}
