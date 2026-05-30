import { api } from '@/lib/axios';
import { ApiResponse, PaginatedResponse, BaseEntity } from '@/types/api';

export interface Category extends BaseEntity {
  nameAr: string;
  nameEn: string;
  iconUrl?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  serviceCount: number;
}

export const cmsApi = {
  getCategories: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Category>>('/cms/categories', { params });
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await api.patch<ApiResponse<Category>>(`/cms/categories/${id}`, data);
    return response.data;
  },

  createCategory: async (data: Omit<Category, keyof BaseEntity | 'serviceCount'>) => {
    const response = await api.post<ApiResponse<Category>>('/cms/categories', data);
    return response.data;
  },

  getBanners: async () => {
    const response = await api.get<ApiResponse<any[]>>('/cms/banners');
    return response.data;
  },
};
