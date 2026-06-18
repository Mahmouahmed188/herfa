import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Address } from '../types';

export const addressApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Address[]>>('/addresses');
    return response.data;
  },

  create: async (data: Omit<Address, keyof import('@/types/api').BaseEntity | 'userId'>) => {
    const response = await api.post<ApiResponse<Address>>('/addresses', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Address>) => {
    const response = await api.patch<ApiResponse<Address>>(`/addresses/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/addresses/${id}`);
    return response.data;
  },

  setDefault: async (id: string) => {
    const response = await api.patch<ApiResponse<Address>>(`/addresses/${id}/default`);
    return response.data;
  },
};
