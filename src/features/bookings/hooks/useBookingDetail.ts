import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../services/api';
import { CustomerBooking } from '../types';

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ['bookings', 'detail', id],
    queryFn: async () => {
      const response = await bookingApi.getJobById(id);
      return (response?.data ?? response) as CustomerBooking;
    },
    enabled: !!id,
  });
}