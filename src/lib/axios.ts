import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle global errors (e.g. 401 logout)
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    // Normalize error response
    const normalizedError: ApiError = {
      success: false,
      error: {
        code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
        message: error.response?.data?.error?.message || error.message || 'An unexpected error occurred',
        details: error.response?.data?.error?.details,
      },
    };

    return Promise.reject(normalizedError);
  }
);
