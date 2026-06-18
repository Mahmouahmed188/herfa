'use client';

import { Bell, ExternalLink, CheckCheck } from 'lucide-react';
import { CustomerNotification } from '../types';
import { getDeepLinkPath } from '../services/deepLink';
import { useRouter } from '@/lib/navigation';

interface NotificationDetailProps {
  notification: CustomerNotification;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationDetail({ notification, onMarkAsRead }: NotificationDetailProps) {
  const router = useRouter();
  const linkPath = getDeepLinkPath(notification.type, notification.data);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{notification.title}</h1>
          <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
            {notification.type} &middot; {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
        <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">{notification.body}</p>
      </div>

      {notification.data && Object.keys(notification.data).length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Details</p>
          <div className="space-y-1">
            {Object.entries(notification.data).map(([key, value]) => (
              value && (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-gray-400">{key}</span>
                  <span className="text-slate-700 dark:text-gray-200 font-mono">{String(value)}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {linkPath && (
          <button
            onClick={() => router.push(linkPath as Parameters<typeof router.push>[0])}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View related
          </button>
        )}
        {!notification.isRead && onMarkAsRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}