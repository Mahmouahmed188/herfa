import { api } from '@/lib/axios';
import { PaginatedResponse, ApiResponse, User } from '@/types/api';

export const usersApi = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
    role?: string;
    status?: string;
  }) => {
    const response = await api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  getUserDetails: async (id: string) => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id: string, status: 'ACTIVE' | 'SUSPENDED', reason: string) => {
    const response = await api.post<ApiResponse<any>>(`/users/${id}/status`, {
      status,
      reason,
    });
    return response.data;
  },

  getUserActivity: async (id: string) => {
    const response = await api.get<ApiResponse<any[]>>(`/users/${id}/activity`);
    return response.data;
  },
};
