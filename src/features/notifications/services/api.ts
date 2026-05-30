import { api } from '@/lib/axios';
import { ApiResponse, PaginatedResponse, BaseEntity } from '@/types/api';

export interface BroadcastNotification extends BaseEntity {
  title: string;
  message: string;
  target: 'ALL' | 'CLIENTS' | 'PROVIDERS';
  type: 'PUSH' | 'SMS' | 'EMAIL';
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
  sentCount: number;
}

export const notificationsApi = {
  getBroadcasts: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<BroadcastNotification>>('/notifications/broadcasts', { params });
    return response.data;
  },

  sendBroadcast: async (data: Omit<BroadcastNotification, keyof BaseEntity | 'sentCount' | 'status'>) => {
    const response = await api.post<ApiResponse<BroadcastNotification>>('/notifications/broadcasts', data);
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get<ApiResponse<any[]>>('/notifications/templates');
    return response.data;
  },
};
