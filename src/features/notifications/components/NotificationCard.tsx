import { Bell, BookOpen, Megaphone, Tag } from 'lucide-react';
import { CustomerNotification, CustomerNotificationType } from '../types';

const typeIcons: Record<CustomerNotificationType, typeof Bell> = {
  BOOKING_UPDATE: BookOpen,
  ANNOUNCEMENT: Megaphone,
  PROMO: Tag,
  SYSTEM: Bell,
};

const typeColors: Record<CustomerNotificationType, string> = {
  BOOKING_UPDATE: 'text-blue-500 bg-blue-500/10',
  ANNOUNCEMENT: 'text-purple-500 bg-purple-500/10',
  PROMO: 'text-amber-500 bg-amber-500/10',
  SYSTEM: 'text-slate-500 bg-slate-500/10',
};

interface NotificationCardProps {
  notification: CustomerNotification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  const Icon = typeIcons[notification.type] || Bell;

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
        notification.isRead
          ? 'bg-white dark:bg-surface-dark'
          : 'bg-primary/5 dark:bg-primary/10 border border-primary/20'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeColors[notification.type] || typeColors.SYSTEM}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`text-sm ${notification.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white font-semibold'}`}>
              {notification.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{notification.body}</p>
          </div>
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Mark read
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
          {new Date(notification.createdAt).toLocaleDateString()}{' '}
          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
