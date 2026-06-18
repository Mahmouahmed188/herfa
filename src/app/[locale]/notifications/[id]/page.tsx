'use client';

import * as React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCustomerNotifications, useMarkAsRead } from '@/features/notifications/hooks/useCustomerNotifications';
import { NotificationDetail } from '@/features/notifications/components/NotificationDetail';
import { CustomerNotification } from '@/features/notifications/types';

export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useCustomerNotifications(1, 100);
  const markAsRead = useMarkAsRead();

  const rawData = data as { data?: CustomerNotification[] } | CustomerNotification[] | undefined;
  const notifications = Array.isArray(rawData) ? rawData : rawData?.data ?? [];
  const notification = notifications.find((n) => n.id === params.id);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-center">
        <p className="text-slate-500 dark:text-gray-400 mb-4">Notification not found</p>
        <Link href="/client/notifications" className="text-primary text-sm font-semibold hover:underline">
          Back to notifications
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <Link href="/client/notifications" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to notifications
      </Link>

      <NotificationDetail
        notification={notification}
        onMarkAsRead={(id) => markAsRead.mutate([id])}
      />
    </div>
  );
}