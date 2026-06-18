import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../services/api';

export interface TimelineEventData {
  id: string;
  type: 'STATUS_CHANGE' | 'PROVIDER_ASSIGNED' | 'PROVIDER_ACCEPTED' | 'PROVIDER_REJECTED' | 'TRACKING_STARTED' | 'LOCATION_UPDATED' | 'CANCELLED' | 'COMPLETED' | 'PAYMENT' | 'DISPUTE' | 'MESSAGE';
  status?: string;
  title: string;
  description: string;
  actor?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export function useBookingTimeline(bookingId: string) {
  return useQuery({
    queryKey: ['bookings', 'timeline', bookingId],
    queryFn: async () => {
      const response = await bookingApi.getBookingTimeline(bookingId);
      return (response?.data ?? []) as TimelineEventData[];
    },
    enabled: !!bookingId,
  });
}