'use client';

import { useParams } from 'next/navigation';
import { Loader2, ArrowLeft, MapPin, Phone, Star, CreditCard, Clock, Package } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBookingDetail } from '@/features/bookings/hooks/useBookingDetail';
import { BookingTimeline } from '@/features/bookings/components/BookingTimeline';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  ACCEPTED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  IN_PROGRESS: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  CANCELLED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  DISPUTED: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: booking, isLoading, isError } = useBookingDetail(id);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="space-y-4 max-w-3xl">
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

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/client/jobs" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {booking.service?.name || booking.title || 'Service Request'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Posted on {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyles[booking.status] || ''}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {booking.description && (
              <p className="text-sm text-slate-600 dark:text-gray-400">{booking.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {booking.timeline && booking.timeline.length > 0 ? (
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
      </div>
    </div>
  );
}
