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

export interface NotificationTemplate extends BaseEntity {
  name: string;
  subject: string;
  body: string;
  channel: 'PUSH' | 'SMS' | 'EMAIL';
  placeholders?: string;
}

export const notificationsApi = {
  getBroadcasts: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<BroadcastNotification>>('/notifications/announcements', { params });
    return response.data;
  },

  sendBroadcast: async (data: Omit<BroadcastNotification, keyof BaseEntity | 'sentCount' | 'status'>) => {
    const response = await api.post<ApiResponse<BroadcastNotification>>('/notifications/announcements', data);
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get<ApiResponse<NotificationTemplate[]>>('/notifications/templates');
    return response.data;
  },

  createTemplate: async (data: Omit<NotificationTemplate, keyof BaseEntity>) => {
    const response = await api.post<ApiResponse<NotificationTemplate>>('/notifications/templates', data);
    return response.data;
  },

  updateTemplate: async (id: string, data: Partial<NotificationTemplate>) => {
    const response = await api.patch<ApiResponse<NotificationTemplate>>(`/notifications/templates/${id}`, data);
    return response.data;
  },
};
