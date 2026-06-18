import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { CustomerBooking } from '../types';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  ACCEPTED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  IN_PROGRESS: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  CANCELLED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  DISPUTED: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export function BookingCard({ booking }: { booking: CustomerBooking }) {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2 bg-primary" />
        <CardContent className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[booking.status] || ''}`}>
                {booking.status}
              </span>
              {booking.createdAt && (
                <span className="text-xs text-muted-foreground">
                  Posted on {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold">{booking.service?.name || booking.title || 'Service Request'}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {booking.address || 'Address pending'}
              </span>
            </div>
            {booking.amount != null && (
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                ${booking.amount.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start md:items-end justify-center gap-2">
            <Link
              href={{ pathname: '/client/jobs/[id]', params: { id: booking.id } }}
              className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
            >
              View Details <ArrowRight className="w-3 h-3" />
            </Link>
            {booking.status === 'COMPLETED' && (
              <Link
                href={{ pathname: '/client/reviews/new/[bookingId]', params: { bookingId: booking.id } }}
                className="text-primary text-sm font-semibold hover:underline"
              >
                Write a Review
              </Link>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
