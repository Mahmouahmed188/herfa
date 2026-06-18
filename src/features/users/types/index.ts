// User Management Types

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'client' | 'technician' | 'admin';
  status: 'active' | 'suspended' | 'pending' | 'banned';
  registrationDate: string;
  lastLogin: string | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  avatar: string | null;
  bio: string | null;
  address: Address | null;
  preferences: UserPreferences;
  verification: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  language: 'en' | 'ar';
  notifications: boolean;
  theme: 'light' | 'dark';
}

export interface VerificationStatus {
  status: 'pending' | 'approved' | 'rejected';
  documents: VerificationDocument[];
}

export interface VerificationDocument {
  id: string;
  type: 'id' | 'license' | 'certificate' | 'insurance' | 'other';
  url: string;
  filename: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UserBooking {
  id: string;
  service: string;
  provider: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  scheduledDate: string;
  totalAmount: number;
}

export interface UserActivitySummary {
  totalBookings: number;
  totalSpent: number;
  lastActivity: string;
}

export interface UserDetail {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'client' | 'technician' | 'admin';
  status: 'active' | 'suspended' | 'pending' | 'banned';
  registrationDate: string;
  lastLogin: string | null;
  profile: UserProfile;
  bookingHistory: UserBooking[];
  activitySummary: UserActivitySummary;
}

export interface UserListQuery {
  page: number;
  limit: number;
  search?: string;
  role?: 'client' | 'technician' | 'admin';
  status?: 'active' | 'suspended' | 'pending' | 'banned';
}

export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserStatusUpdate {
  status: 'suspended' | 'reactivated';
  reason?: string;
}

export interface UserAction {
  action: 'suspend' | 'reactivate';
  userId: string;
  reason?: string;
  adminId: string;
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'technician' | 'admin';
  status: 'active' | 'suspended' | 'pending' | 'banned';
}

export interface UserFilterOptions {
  roles: ('client' | 'technician' | 'admin')[];
  statuses: ('active' | 'suspended' | 'pending' | 'banned')[];
}

// Dashboard Types
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  newUsersThisMonth: number;
  userGrowth: number;
}

export interface RecentUserActivity {
  id: string;
  userName: string;
  action: string;
  timestamp: string;
  details?: string;
}

// Error Types
export interface UserError {
  code: string;
  message: string;
  details?: string;
}

// Loading States
export interface UserLoadingState {
  isLoading: boolean;
  isUpdating: boolean;
  isSuspending: boolean;
  isReactivating: boolean;
}