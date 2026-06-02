import { api } from '@/lib/axios';
import { PaginatedResponse, ApiResponse, BaseEntity } from '@/types/api';

export interface Booking extends BaseEntity {
  id: string;
  userId: string;
  userName: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  amount: number;
  scheduledAt: string;
  dispute?: {
    reason: string;
    description: string;
    openedAt: string;
    status: 'OPEN' | 'RESOLVED';
  };
}

export const bookingApi = {
  getBookingDetails: async (id: string) => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },

  resolveDispute: async (id: string, action: 'REFUND' | 'RELEASE', notes: string) => {
    const response = await api.post<ApiResponse<any>>(`/bookings/${id}/resolve-dispute`, {
      action,
      notes,
    });
    return response.data;
  },

  getBookingTimeline: async (id: string) => {
    const response = await api.get<ApiResponse<any[]>>(`/bookings/${id}/timeline`);
    return response.data;
  },
};
