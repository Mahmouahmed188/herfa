import { Loader2, Bell, AlertCircle } from 'lucide-react';
import { NotificationCard } from './NotificationCard';
import { CustomerNotification } from '../types';
import { Card, CardContent } from '@/components/ui/card';

interface CustomerNotificationListProps {
  notifications: CustomerNotification[];
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onMarkAsRead: (id: string) => void;
}

export function CustomerNotificationList({ notifications, isLoading, isError, onRetry, onMarkAsRead }: CustomerNotificationListProps) {
  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to load notifications</h2>
          <p className="text-muted-foreground mb-4">Something went wrong. Please try again.</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">No notifications</h2>
          <p className="text-muted-foreground">You&apos;re all caught up! Check back later for updates.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}
