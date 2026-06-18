import { Loader2, Bell } from 'lucide-react';
import { NotificationCard } from './NotificationCard';
import { CustomerNotification } from '../types';
import { Card, CardContent } from '@/components/ui/card';

interface CustomerNotificationListProps {
  notifications: CustomerNotification[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
}

export function CustomerNotificationList({ notifications, isLoading, onMarkAsRead }: CustomerNotificationListProps) {
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
