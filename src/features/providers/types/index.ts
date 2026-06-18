// Provider Management Types

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface ProviderRatings {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ProviderService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface ProviderReview {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ProviderStatistics {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  averageResponseTime: number;
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  categories: ServiceCategory[];
  ratings: ProviderRatings;
  verification: ProviderVerification;
  isActive: boolean;
  registrationDate: string;
  lastActivity: string | null;
}

export interface ProviderDetail {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  categories: ServiceCategory[];
  ratings: ProviderRatings;
  verification: ProviderVerificationDetail;
  services: ProviderService[];
  reviews: ProviderReview[];
  statistics: ProviderStatistics;
  isActive: boolean;
  registrationDate: string;
  lastActivity: string | null;
}

export interface ProviderVerification {
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  submittedAt: string | null;
}

export interface ProviderVerificationDetail {
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  documents: VerificationDocument[];
  history: VerificationHistory[];
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface VerificationDocument {
  id: string;
  type: 'id' | 'license' | 'certificate' | 'insurance' | 'other';
  url: string;
  filename: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface VerificationHistory {
  id: string;
  action: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'suspended';
  adminId: string | null;
  notes: string | null;
  timestamp: string;
}

export interface ProviderListQuery {
  page: number;
  limit: number;
  search?: string;
  status?: 'pending' | 'approved' | 'suspended' | 'rejected';
  category?: string;
}

export interface ProviderListResponse {
  providers: Provider[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProviderStatusUpdate {
  status: 'approved' | 'suspended' | 'reactivated';
  notes?: string;
}

export interface TopProvider {
  id: string;
  name: string;
  revenue: number;
  bookings: number;
  rating: number;
  satisfaction: number;
}

// Verification Types
export interface PendingVerification {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  status: 'pending';
  submittedAt: string | null;
  documents: VerificationDocument[];
}

export interface PendingVerificationListResponse {
  verifications: PendingVerification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VerificationAction {
  action: 'approve' | 'reject';
  notes?: string;
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
export interface ProviderFormData {
  name: string;
  email: string;
  phone: string;
  categories: string[];
  description?: string;
}

export interface VerificationFormData {
  action: 'approve' | 'reject';
  reason?: string;
  notes?: string;
}

// Dashboard Types
export interface ProviderStats {
  totalProviders: number;
  activeProviders: number;
  pendingVerifications: number;
  averageRating: number;
  providerGrowth: number;
}

export interface PopularService {
  service: string;
  providers: number;
  bookings: number;
  revenue: number;
}

// Error Types
export interface ProviderError {
  code: string;
  message: string;
  details?: string;
}

// Loading States
export interface ProviderLoadingState {
  isLoading: boolean;
  isUpdating: boolean;
  isApproving: boolean;
  isSuspending: boolean;
  isReactivating: boolean;
}