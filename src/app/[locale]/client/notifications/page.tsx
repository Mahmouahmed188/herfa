'use client';

import * as React from 'react';
import { Bell } from 'lucide-react';
import { useCustomerNotifications, useMarkAsRead } from '@/features/notifications/hooks/useCustomerNotifications';
import { CustomerNotificationList } from '@/features/notifications/components/CustomerNotificationList';
import { CustomerNotification } from '@/features/notifications/types';

export default function NotificationsPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useCustomerNotifications(page, 20);
  const markAsRead = useMarkAsRead();

  const rawData = data as { data?: CustomerNotification[]; total?: number } | CustomerNotification[] | undefined;
  const notifications = Array.isArray(rawData)
    ? rawData
    : rawData?.data ?? [];

  const total = !Array.isArray(rawData) ? (rawData?.total ?? notifications.length) : notifications.length;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate([id]);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={() => {
              const unreadIds = notifications
                .filter((n) => !n.isRead)
                .map((n) => n.id);
              if (unreadIds.length > 0) markAsRead.mutate(unreadIds);
            }}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <CustomerNotificationList
        notifications={notifications}
        isLoading={isLoading}
        onMarkAsRead={handleMarkAsRead}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-surface-border text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-surface-border text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
