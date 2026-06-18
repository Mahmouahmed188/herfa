import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../services/api';
import { CustomerBooking } from '../types';

export function useActiveBookings() {
  return useQuery({
    queryKey: ['bookings', 'active'],
    queryFn: async () => {
      const response = await bookingApi.getMyJobs();
      const data = Array.isArray(response?.data ?? response) ? (response?.data ?? response) : [];
      const activeStatuses = ['PENDING', 'ACCEPTED', 'ASSIGNED', 'IN_PROGRESS', 'ON_THE_WAY'];
      return data.filter((job: CustomerBooking) => activeStatuses.includes(job.status)) as CustomerBooking[];
    },
  });
}