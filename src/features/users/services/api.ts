import { api } from '@/lib/axios';
import { UserSchemas } from '../schemas';
import type { 
  User, 
  UserDetail, 
  UserListQuery, 
  UserListResponse,
  UserStatusUpdate,
  UserAction 
} from '../types';

export const usersApi = {
  /**
   * Get paginated list of users
   */
  getUsers: async (query: UserListQuery) => {
    const params = {
      page: query.page,
      limit: query.limit,
      ...(query.search && { search: query.search }),
      ...(query.role && { role: query.role }),
      ...(query.status && { status: query.status }),
    };

    const response = await api.get('/admin/users', { params });
    return UserSchemas.listResponse.parse(response.data);
  },

  /**
   * Get detailed user information
   */
  getUserDetail: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return UserSchemas.detail.parse(response.data);
  },

  /**
   * Suspend a user account
   */
  suspendUser: async (userId: string, data: UserStatusUpdate) => {
    const response = await api.post(`/admin/users/${userId}/suspend`, data);
    return response.data;
  },

  /**
   * Reactivate a suspended user account
   */
  reactivateUser: async (userId: string, data: UserStatusUpdate) => {
    const response = await api.post(`/admin/users/${userId}/reactivate`, data);
    return response.data;
  },

  /**
   * Get user activity summary
   */
  getUserActivity: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}/activity`);
    return response.data;
  },

  /**
   * Get user booking history
   */
  getUserBookings: async (userId: string, page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get(`/admin/users/${userId}/bookings`, { params });
    return response.data;
  },

  /**
   * Search users with advanced filters
   */
  searchUsers: async (filters: {
    search?: string;
    role?: string;
    status?: string;
    registrationDate?: string;
    lastLogin?: string;
  }) => {
    const params = { ...filters };
    const response = await api.get('/admin/users/search', { params });
    return response.data;
  },

  /**
   * Get user statistics
   */
  getUserStats: async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
  },

  /**
   * Get user export data
   */
  exportUsers: async (format: 'csv' | 'excel' | 'json', filters?: any) => {
    const params = { format, ...filters };
    const response = await api.get('/admin/users/export', { params });
    return response.data;
  },

  /**
   * Bulk user operations
   */
  bulkUpdateUsers: async (updates: Array<{
    userId: string;
    action: 'suspend' | 'reactivate';
    reason?: string;
  }>) => {
    const response = await api.post('/admin/users/bulk-update', { updates });
    return response.data;
  },

  /**
   * Get user login history
   */
  getUserLoginHistory: async (userId: string, page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get(`/admin/users/${userId}/login-history`, { params });
    return response.data;
  },

  /**
   * Get user device information
   */
  getUserDevices: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}/devices`);
    return response.data;
  },
};