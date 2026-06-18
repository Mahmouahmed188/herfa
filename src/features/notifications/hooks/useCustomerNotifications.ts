import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { notificationSocketService } from '../services/socket';
import { CustomerNotification } from '../types';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

const FINANCE_NOTIFICATION_TYPES = new Set([
  'PAYMENT_CREATED',
  'PAYMENT_CONFIRMED',
  'REFUND_CREATED',
  'REFUND_APPROVED',
  'REFUND_REJECTED',
]);

/**
 * Manages the socket lifecycle for the authenticated user.
 * Connect once when authenticated, disconnect cleanly on logout.
 * Called once at the app level (in Providers) so the socket is never
 * created more than once regardless of how many components use it.
 */
export function useNotificationSocket() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);
  // Track the token we last connected with so we can reconnect on token rotation.
  const connectedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // User logged out — tear down the socket cleanly.
      notificationSocketService.disconnect();
      connectedTokenRef.current = null;
      return;
    }

    if (connectedTokenRef.current === token) {
      // Same token, socket already connected or connecting — do nothing.
      return;
    }

    if (connectedTokenRef.current && connectedTokenRef.current !== token) {
      // Token was rotated (refresh) — reconnect with fresh credentials.
      notificationSocketService.reconnectWithToken(token);
    } else {
      // First connect after login.
      notificationSocketService.connect();
    }

    connectedTokenRef.current = token;

    return () => {
      // Only disconnect when the component that owns the socket unmounts
      // (i.e. when the entire app unmounts, not on every re-render).
    };
  }, [isAuthenticated, token]);
}

export function useCustomerNotifications(
  page = 1,
  limit = 20,
  filters?: { isRead?: boolean; type?: string }
) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleNotification = (_notification: CustomerNotification) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      if (FINANCE_NOTIFICATION_TYPES.has(_notification.type as string)) {
        queryClient.invalidateQueries({ queryKey: ['finance'] });
      }
    };

    notificationSocketService.onNotification(handleNotification);

    return () => {
      notificationSocketService.offNotification(handleNotification);
    };
  }, [queryClient, isAuthenticated]);

  return useQuery({
    queryKey: ['notifications', 'customer', { page, limit, filters }],
    queryFn: async () => {
      try {
        return await api.getNotifications(page, limit, filters);
      } catch (error) {
        console.error('Failed to load notifications:', error);
        // Return empty data instead of throwing
        return { data: [], total: 0 };
      }
    },
    enabled: isAuthenticated,
  });
}

export function useUnreadCount() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

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
    queryFn: async () => {
      try {
        return await api.getUnreadNotificationsCount();
      } catch (error) {
        console.error('Failed to load unread count:', error);
        // Return default count instead of throwing
        return { count: 0 };
      }
    },
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
