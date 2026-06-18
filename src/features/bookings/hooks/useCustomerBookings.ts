import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../services/api';
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
      const response = await bookingApi.getMyJobs(params);
      const meta = (response as any)?.meta;
      const data = Array.isArray(response?.data ?? response) ? (response?.data ?? response) : [];
      return {
        data: data as CustomerBooking[],
        total: meta?.total ?? data.length,
        page: meta?.page ?? filters.page,
        limit: meta?.limit ?? filters.limit,
      };
    },
    placeholderData: (previousData) => previousData,
  });
}