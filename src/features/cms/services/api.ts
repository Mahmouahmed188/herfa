import { api } from '@/lib/axios';
import { ApiResponse, PaginatedResponse, BaseEntity } from '@/types/api';

export interface Category extends BaseEntity {
  nameAr: string;
  nameEn: string;
  iconUrl?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  serviceCount: number;
}

export interface Banner extends BaseEntity {
  titleAr: string;
  titleEn: string;
  linkUrl?: string;
  imageUrl?: string;
  priority: number;
  status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';
  scheduledAt?: string;
}

export const cmsApi = {
  getCategories: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Category>>('/admin/categories', { params });
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await api.patch<ApiResponse<Category>>(`/admin/categories/${id}`, data);
    return response.data;
  },

  createCategory: async (data: Omit<Category, keyof BaseEntity | 'serviceCount'>) => {
    const response = await api.post<ApiResponse<Category>>('/admin/categories', data);
    return response.data;
  },

  getBanners: async () => {
    const response = await api.get<ApiResponse<Banner[]>>('/cms/banners');
    return response.data;
  },

  createBanner: async (data: Omit<Banner, keyof BaseEntity>) => {
    const response = await api.post<ApiResponse<Banner>>('/cms/banners', data);
    return response.data;
  },

  updateBanner: async (id: string, data: Partial<Banner>) => {
    const response = await api.patch<ApiResponse<Banner>>(`/cms/banners/${id}`, data);
    return response.data;
  },
};
