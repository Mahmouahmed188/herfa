import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';
import { CustomerBooking } from '../types';

export function useActiveBookings() {
  return useQuery({
    queryKey: ['bookings', 'active'],
    queryFn: async () => {
      const response = await api.getMyJobs();
      const jobs = Array.isArray(response) ? response : [];
      const activeStatuses = ['PENDING', 'ACCEPTED', 'IN_PROGRESS'];
      return jobs.filter((job: CustomerBooking) => activeStatuses.includes(job.status)) as CustomerBooking[];
    },
  });
}
