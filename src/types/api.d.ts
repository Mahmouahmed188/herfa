export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type PaginatedResponse<T> = ApiResponse<T[]>;

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT' | 'FINANCE' | 'CONTENT';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
}
