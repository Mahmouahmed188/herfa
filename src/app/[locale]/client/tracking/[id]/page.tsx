'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { useBookingDetail } from '@/features/bookings/hooks/useBookingDetail';
import { useTracking } from '@/features/bookings/hooks/useTracking';
import { BookingTracking } from '@/features/bookings/components/BookingTracking';
import { TrackingMap } from '@/features/bookings/components/TrackingMap';

export default function TrackingPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: booking, isLoading: bookingLoading } = useBookingDetail(id);
  const {
    session,
    events,
    isLoading: trackingLoading,
    error,
    wsConnected,
  } = useTracking(id);

  if (bookingLoading || trackingLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href={{ pathname: '/client/jobs/[id]', params: { id } }} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to booking details
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Tracking: {booking?.service?.name || booking?.title || 'Booking'}
      </h1>

      <BookingTracking
        session={session ?? null}
        events={events}
        isLoading={trackingLoading}
        error={error}
        wsConnected={wsConnected}
      />

      <TrackingMap
        latitude={session?.providerLatitude}
        longitude={session?.providerLongitude}
        providerName={booking?.provider?.name}
      />
    </div>
  );
}