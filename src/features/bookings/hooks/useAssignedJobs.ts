import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../services/api';

export function useAssignedJobs() {
  return useQuery({
    queryKey: ['bookings', 'assigned'],
    queryFn: async () => {
      const response = await bookingApi.getAssignedJobs();
      return (response?.data ?? []) as any[];
    },
  });
}