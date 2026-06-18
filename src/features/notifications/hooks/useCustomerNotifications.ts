import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { notificationSocketService } from '../services/socket';
import { CustomerNotification } from '../types';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export function useCustomerNotifications(page = 1, limit = 20, filters?: { isRead?: boolean; type?: string }) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    notificationSocketService.connect();

    const handleNotification = (_notification: CustomerNotification) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    };

    notificationSocketService.onNotification(handleNotification);

    return () => {
      notificationSocketService.offNotification(handleNotification);
    };
  }, [queryClient, isAuthenticated]);

  return useQuery({
    queryKey: ['notifications', 'customer', { page, limit, filters }],
    queryFn: () => api.getNotifications(page, limit, filters),
    enabled: isAuthenticated,
  });
}

export function useUnreadCount() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    notificationSocketService.connect();

    const handleUnreadCount = (data: { count: number }) => {
      queryClient.setQueryData(['notifications', 'unread-count'], data);
    };

    notificationSocketService.onUnreadCount(handleUnreadCount);

    return () => {
      notificationSocketService.offUnreadCount(handleUnreadCount);
    };
  }, [queryClient, isAuthenticated]);

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.getUnreadNotificationsCount(),
    refetchInterval: isAuthenticated ? 30000 : false,
    enabled: isAuthenticated,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationIds: string[]) => {
      if (notificationIds.length === 1) {
        return api.markNotificationAsRead(notificationIds[0]);
      }
      return api.markNotificationsAsRead(notificationIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('Notifications marked as read');
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('All notifications marked as read');
    },
  });
}
