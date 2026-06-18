'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { bookingApi } from '@/features/bookings/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loading } from '@/components/common/Loading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingTimeline } from '@/features/bookings/components/BookingTimeline';
import { useBookingTimeline } from '@/features/bookings/hooks/useBookingTimeline';
import { DisputePanel } from '@/features/bookings/components/DisputePanel';
import { toast } from 'sonner';

const statusVariant: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  PENDING: 'secondary',
  ACCEPTED: 'default',
  ASSIGNED: 'default',
  IN_PROGRESS: 'default',
  ON_THE_WAY: 'default',
  COMPLETED: 'outline',
  CANCELLED: 'outline',
  DISPUTED: 'destructive',
};

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: bookingData, isLoading: isBookingLoading } = useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingApi.getBookingDetails(id),
  });

  const { data: timelineEvents = [], isLoading: isTimelineLoading } = useBookingTimeline(id);

  const resolveMutation = useMutation({
    mutationFn: (data: { action: 'REFUND' | 'RELEASE'; notes: string }) =>
      bookingApi.resolveDispute(id, data.action, data.notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
      toast.success('Dispute resolved successfully');
    },
  });

  if (isBookingLoading || isTimelineLoading) return <Loading fullPage />;
  if (!bookingData?.data) return <div className="p-8 text-center">Booking not found</div>;

  const booking = bookingData.data;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking #{booking.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">{booking.serviceName} for {booking.userName}</p>
        </div>
        <Badge variant={statusVariant[booking.status] || 'default'} className="px-4 py-1 text-lg">
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium">{booking.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold">{booking.amount} SAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scheduled:</span>
                <span className="font-medium">{new Date(booking.scheduledAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {booking.status === 'DISPUTED' && (
            <DisputePanel
              bookingId={booking.id}
              onResolve={(data) => resolveMutation.mutate(data)}
              isSubmitting={resolveMutation.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
