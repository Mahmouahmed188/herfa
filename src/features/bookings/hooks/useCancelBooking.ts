'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../services/api';
import { toast } from 'sonner';

export function useCancelBooking(bookingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) => bookingApi.cancelBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'customer'] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      const message = error?.error?.message || error?.message || 'Failed to cancel booking';
      toast.error(message);
    },
  });
}