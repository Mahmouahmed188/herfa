'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft, MapPin, Phone, Star, CreditCard, Clock, Hash, XCircle, Navigation } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBookingDetail } from '@/features/bookings/hooks/useBookingDetail';
import { useBookingTimeline } from '@/features/bookings/hooks/useBookingTimeline';
import { BookingTimeline } from '@/features/bookings/components/BookingTimeline';
import { CancelBookingDialog } from '@/features/bookings/components/CancelBookingDialog';
import { useTracking } from '@/features/bookings/hooks/useTracking';
import { Badge } from '@/components/ui/badge';
import { TrackingMapView } from '@/components/map/TrackingMapView';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  ACCEPTED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  ASSIGNED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
  IN_PROGRESS: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  ON_THE_WAY: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  CANCELLED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  DISPUTED: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

const cancellableStatuses = ['PENDING', 'ACCEPTED', 'ASSIGNED'];
const trackableStatuses = ['ON_THE_WAY', 'IN_PROGRESS'];

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [cancelOpen, setCancelOpen] = useState(false);
  const { data: booking, isLoading, isError } = useBookingDetail(id);
  const { data: timelineEvents = [] } = useBookingTimeline(id);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Link href="/client/jobs" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to orders
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">Failed to load booking details.</p>
            <Link href="/client/jobs">
              <Button variant="outline" className="mt-4">Go back to orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canCancel = cancellableStatuses.includes(booking.status);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href="/client/jobs" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {booking.service?.name || booking.title || 'Service Request'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Created on {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyles[booking.status] || ''}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" /> Booking Information
            </CardTitle>
            <span className="text-xs text-slate-400 dark:text-gray-500 font-mono">#{booking.id.slice(0, 8)}</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {booking.notes && (
              <p className="text-sm text-slate-600 dark:text-gray-400">
                <span className="font-semibold text-slate-900 dark:text-white">Notes:</span> {booking.notes}
              </p>
            )}
            {booking.description && (
              <p className="text-sm text-slate-600 dark:text-gray-400">
                <span className="font-semibold text-slate-900 dark:text-white">Description:</span> {booking.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {booking.address && (
                <span className="flex items-center gap-1 text-slate-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" /> {booking.address}
                </span>
              )}
              {booking.scheduledAt && (
                <span className="flex items-center gap-1 text-slate-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" /> {new Date(booking.scheduledAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {booking.amount != null && (
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${booking.amount.toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" /> Service Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            {booking.provider ? (
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center shrink-0 border-2 border-primary/20"
                  style={booking.provider.avatarUrl ? { backgroundImage: `url("${booking.provider.avatarUrl}")` } : {}}
                >
                  {!booking.provider.avatarUrl && (
                    <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {booking.provider.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{booking.provider.name}</p>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400 mt-1">
                    {booking.provider.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {booking.provider.phone}
                      </span>
                    )}
                    {booking.provider.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" /> {booking.provider.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-gray-400">No provider assigned yet.</p>
            )}
          </CardContent>
        </Card>

        {booking.status === 'COMPLETED' && (
          <Card>
            <CardContent className="pt-6">
              <Link href={{ pathname: '/client/reviews/new/[bookingId]', params: { bookingId: id } }}>
                <Button variant="primary" className="w-full">
                  Write a Review
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {booking.payment ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-gray-400">Status</span>
                  <span className={`font-semibold ${
                    booking.payment.status === 'PAID' ? 'text-emerald-600 dark:text-emerald-400' :
                    booking.payment.status === 'UNPAID' ? 'text-amber-600 dark:text-amber-400' :
                    'text-slate-600 dark:text-gray-400'
                  }`}>
                    {booking.payment.status}
                  </span>
                </div>
                {booking.payment.method && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-gray-400">Method</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{booking.payment.method}</span>
                  </div>
                )}
                {booking.payment.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-gray-400">Paid on</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {new Date(booking.payment.paidAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-gray-400">Payment details not available.</p>
            )}
          </CardContent>
        </Card>

        {trackableStatuses.includes(booking.status) && (
          <LiveTrackingSection bookingId={id} />
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timelineEvents.length > 0 ? (
              <BookingTimeline events={timelineEvents} />
            ) : booking.timeline && booking.timeline.length > 0 ? (
              <BookingTimeline
                events={booking.timeline.map((e, i) => ({
                  id: `event-${i}`,
                  type: 'STATUS_CHANGE' as const,
                  title: e.status,
                  description: e.note || `Status changed to ${e.status}`,
                  timestamp: e.timestamp,
                }))}
              />
            ) : (
              <p className="text-sm text-slate-500 dark:text-gray-400">No timeline events available.</p>
            )}
          </CardContent>
        </Card>

        {canCancel && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950 flex items-center gap-2"
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="w-4 h-4" /> Cancel Booking
            </Button>
          </div>
        )}
      </div>

      <CancelBookingDialog
        bookingId={id}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}

function LiveTrackingSection({ bookingId }: { bookingId: string }) {
  const { session, isLoading, error } = useTracking(bookingId);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" /> Live Tracking
        </CardTitle>
        <div className="flex items-center gap-2">
          {session && (
            <Badge variant="outline" className={
              session.status === 'ACTIVE' ? 'text-green-600 border-green-200' :
              session.status === 'PAUSED' ? 'text-amber-600 border-amber-200' :
              'text-slate-600 border-slate-200'
            }>
              {session.status}
            </Badge>
          )}
          <Link
            href={{ pathname: '/client/tracking/[id]', params: { id: bookingId } }}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Full View
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TrackingMapView
          providerLatitude={session?.providerLatitude}
          providerLongitude={session?.providerLongitude}
          providerName="Provider"
          status={session?.status}
          eta={session?.eta}
          lastUpdated={session?.lastUpdated}
          isLoading={isLoading}
          error={error}
        />
        {!isLoading && !session && (
          <p className="text-sm text-slate-500 dark:text-gray-400">No active tracking session.</p>
        )}
      </CardContent>
    </Card>
  );
}