import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';
import { BookingFiltersState, CustomerBooking } from '../types';

export function useCustomerBookings(filters: BookingFiltersState) {
  const params: Record<string, string> = {
    page: String(filters.page),
    limit: String(filters.limit),
    sort: filters.sort === 'newest' ? '-createdAt' : 'createdAt',
  };

  if (filters.status && filters.status !== 'ALL') {
    params.status = filters.status;
  }

  return useQuery({
    queryKey: ['bookings', 'customer', filters],
    queryFn: async () => {
      const response = await api.getMyJobs(params);
      const jobs = Array.isArray(response) ? response : [];
      return {
        data: jobs as CustomerBooking[],
        total: jobs.length,
        page: filters.page,
        limit: filters.limit,
      };
    },
    placeholderData: (previousData) => previousData,
  });
}
