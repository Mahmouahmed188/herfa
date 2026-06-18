import { Bell, BookOpen, Megaphone, Tag, ShieldCheck, Clock, XCircle, FileText, CheckCircle, UserCheck, UserPlus, Play, Flag, Navigation, PauseCircle, PlayCircle, MapPin } from 'lucide-react';
import { useRouter } from '@/lib/navigation';
import { CustomerNotification } from '../types';

const BOOKING_NOTIFICATION_TYPES = new Set([
  'BOOKING_CREATED',
  'BOOKING_ACCEPTED',
  'BOOKING_ASSIGNED',
  'BOOKING_STARTED',
  'BOOKING_COMPLETED',
  'BOOKING_CANCELLED',
  'BOOKING_UPDATE',
]);

const TRACKING_NOTIFICATION_TYPES = new Set([
  'TRACKING_STARTED',
  'TRACKING_PAUSED',
  'TRACKING_RESUMED',
  'TRACKING_ARRIVED',
]);

const typeIcons: Record<string, typeof Bell> = {
  BOOKING_UPDATE: BookOpen,
  BOOKING_CREATED: CheckCircle,
  BOOKING_ACCEPTED: UserCheck,
  BOOKING_ASSIGNED: UserPlus,
  BOOKING_STARTED: Play,
  BOOKING_COMPLETED: Flag,
  BOOKING_CANCELLED: XCircle,
  TRACKING_STARTED: Navigation,
  TRACKING_PAUSED: PauseCircle,
  TRACKING_RESUMED: PlayCircle,
  TRACKING_ARRIVED: MapPin,
  ANNOUNCEMENT: Megaphone,
  PROMO: Tag,
  SYSTEM: Bell,
  VERIFICATION_SUBMITTED: Clock,
  VERIFICATION_APPROVED: ShieldCheck,
  VERIFICATION_REJECTED: XCircle,
  VERIFICATION_SUSPENDED: Bell,
  DOCUMENTS_REQUESTED: FileText,
};

const typeColors: Record<string, string> = {
  BOOKING_UPDATE: 'text-blue-500 bg-blue-500/10',
  BOOKING_CREATED: 'text-blue-500 bg-blue-500/10',
  BOOKING_ACCEPTED: 'text-green-500 bg-green-500/10',
  BOOKING_ASSIGNED: 'text-purple-500 bg-purple-500/10',
  BOOKING_STARTED: 'text-orange-500 bg-orange-500/10',
  BOOKING_COMPLETED: 'text-teal-500 bg-teal-500/10',
  BOOKING_CANCELLED: 'text-red-500 bg-red-500/10',
  TRACKING_STARTED: 'text-blue-500 bg-blue-500/10',
  TRACKING_PAUSED: 'text-amber-500 bg-amber-500/10',
  TRACKING_RESUMED: 'text-green-500 bg-green-500/10',
  TRACKING_ARRIVED: 'text-purple-500 bg-purple-500/10',
  ANNOUNCEMENT: 'text-purple-500 bg-purple-500/10',
  PROMO: 'text-amber-500 bg-amber-500/10',
  SYSTEM: 'text-slate-500 bg-slate-500/10',
  VERIFICATION_SUBMITTED: 'text-amber-500 bg-amber-500/10',
  VERIFICATION_APPROVED: 'text-green-500 bg-green-500/10',
  VERIFICATION_REJECTED: 'text-red-500 bg-red-500/10',
  VERIFICATION_SUSPENDED: 'text-gray-500 bg-gray-500/10',
  DOCUMENTS_REQUESTED: 'text-blue-500 bg-blue-500/10',
};

interface NotificationCardProps {
  notification: CustomerNotification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  const router = useRouter();
  const Icon = typeIcons[notification.type] || Bell;
  const isClickable = BOOKING_NOTIFICATION_TYPES.has(notification.type) || TRACKING_NOTIFICATION_TYPES.has(notification.type);

  const handleClick = () => {
    if (!isClickable || !notification.metadata?.bookingId) return;
    if (TRACKING_NOTIFICATION_TYPES.has(notification.type)) {
      router.push({ pathname: '/client/tracking/[id]', params: { id: notification.metadata.bookingId } });
    } else {
      router.push({ pathname: '/client/jobs/[id]', params: { id: notification.metadata.bookingId } });
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-4 p-4 rounded-xl transition-colors cursor-pointer ${
        isClickable ? 'hover:bg-slate-50 dark:hover:bg-slate-900/50' : ''
      } ${
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
              onClick={handleMarkAsRead}
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
