import { MapPin, Navigation, Clock, Star, Radio } from 'lucide-react';
import { Link, useRouter } from '@/lib/navigation';
import { CustomerBooking } from '../types';

const statusStyles: Record<string, string> = {
  PENDING: 'text-amber-500 bg-amber-500/10',
  ACCEPTED: 'text-blue-500 bg-blue-500/10',
  ASSIGNED: 'text-indigo-500 bg-indigo-500/10',
  IN_PROGRESS: 'text-purple-500 bg-purple-500/10',
  ON_THE_WAY: 'text-cyan-500 bg-cyan-500/10',
};

const statusIcons: Record<string, string> = {
  PENDING: '⏳',
  ACCEPTED: '🗓️',
  ASSIGNED: '👤',
  IN_PROGRESS: '🔧',
  ON_THE_WAY: '🚗',
};

const trackableStatuses = ['ON_THE_WAY', 'IN_PROGRESS'];

interface ActiveBookingCardProps {
  booking: CustomerBooking;
}

export function ActiveBookingCard({ booking }: ActiveBookingCardProps) {
  const router = useRouter();
  const hasTracking = booking.tracking?.available;
  const isTrackable = trackableStatuses.includes(booking.status);

  const handleTrackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push({ pathname: '/client/tracking/[id]', params: { id: booking.id } });
  };

  return (
    <Link
      href={{ pathname: '/client/jobs/[id]', params: { id: booking.id } }}
      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-background-dark hover:bg-slate-100 dark:hover:bg-surface-dark/60 transition-colors cursor-pointer"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${statusStyles[booking.status] || 'text-primary bg-primary/10'}`}>
        {statusIcons[booking.status] || '📋'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
          {booking.service?.name || booking.title || 'Service Request'}
        </p>
        <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          {booking.address || 'Address pending'}
        </p>
        {booking.provider && (
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            {booking.provider.name}
            {booking.provider.rating && ` (${booking.provider.rating})`}
          </p>
        )}
        {hasTracking && booking.tracking?.eta && (
          <p className="text-xs text-primary mt-1 flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            ETA: {new Date(booking.tracking.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          booking.status === 'PENDING' ? 'text-amber-500 bg-amber-500/10' :
          booking.status === 'ACCEPTED' ? 'text-blue-500 bg-blue-500/10' :
          'text-purple-500 bg-purple-500/10'
        }`}>
          {booking.status}
        </span>
        {isTrackable && (
          <button
            onClick={handleTrackClick}
            className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full transition-colors"
          >
            <Radio className="w-3 h-3" /> Track
          </button>
        )}
        {hasTracking && !isTrackable && (
          <span className="flex items-center gap-1 text-xs text-primary">
            <Clock className="w-3 h-3" /> Live
          </span>
        )}
      </div>
    </Link>
  );
}