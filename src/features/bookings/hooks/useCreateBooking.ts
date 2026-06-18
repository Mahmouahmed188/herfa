'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi, CreateBookingPayload } from '../services/api';
import { toast } from 'sonner';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingPayload) => bookingApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'customer'] });
      toast.success('Booking created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });
}