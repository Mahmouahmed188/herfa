import { Loader2 } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { ActiveBookingCard } from './ActiveBookingCard';
import { CustomerBooking } from '../types';

interface ActiveBookingListProps {
  bookings: CustomerBooking[];
  isLoading: boolean;
}

export function ActiveBookingList({ bookings, isLoading }: ActiveBookingListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const ongoing = bookings.filter((b) => b.status === 'IN_PROGRESS');
  const upcoming = bookings.filter((b) => b.status === 'ACCEPTED');
  const pending = bookings.filter((b) => b.status === 'PENDING');

  const sections = [
    { label: 'In Progress', items: ongoing },
    { label: 'Upcoming', items: upcoming },
    { label: 'Pending', items: pending },
  ].filter((s) => s.items.length > 0);

  if (bookings.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-slate-200 dark:border-surface-border rounded-xl">
        <p className="text-sm text-slate-500 dark:text-gray-400">No active orders found.</p>
        <Link href="/client/create-job" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">
          Create a new job
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.label}>
          <h3 className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            {section.label} ({section.items.length})
          </h3>
          <div className="space-y-2">
            {section.items.map((booking) => (
              <ActiveBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
