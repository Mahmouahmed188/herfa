import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';
import { CustomerBooking } from '../types';

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ['bookings', 'detail', id],
    queryFn: async () => {
      const response = await api.getJobById(id);
      return response as CustomerBooking;
    },
    enabled: !!id,
  });
}
