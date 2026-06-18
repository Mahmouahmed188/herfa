// Verification Management Types

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

export interface Verification {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface VerificationDetail {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  documents: VerificationDocument[];
  history: VerificationHistory[];
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface PendingVerification {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  status: 'pending';
  submittedAt: string | null;
  documents: VerificationDocument[];
}

export interface PendingVerificationQuery {
  page: number;
  limit: number;
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

export interface VerificationApproval {
  notes?: string;
}

export interface VerificationRejection {
  reason: string;
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

// Dashboard Types
export interface VerificationStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalSuspended: number;
  averageReviewTime: number;
  verificationTrend: VerificationTrendItem[];
}

export interface VerificationTrendItem {
  date: string;
  submitted: number;
  approved: number;
  rejected: number;
}

export interface DocumentTypeStats {
  type: 'id' | 'license' | 'certificate' | 'insurance' | 'other';
  pending: number;
  approved: number;
  rejected: number;
}

export interface RecentVerification {
  id: string;
  providerName: string;
  providerEmail: string;
  status: string;
  submittedAt: string;
}

// Form Types
export interface VerificationFormData {
  action: 'approve' | 'reject';
  reason?: string;
  notes?: string;
}

export interface DocumentReview {
  documentId: string;
  status: 'approved' | 'rejected';
  reason?: string;
  notes?: string;
}

// Error Types
export interface VerificationError {
  code: string;
  message: string;
  details?: string;
}

// Loading States
export interface VerificationLoadingState {
  isLoading: boolean;
  isUpdating: boolean;
  isApproving: boolean;
  isRejecting: boolean;
}

// Document Types
export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  maxSize: number;
  allowedTypes: string[];
}

export interface DocumentUpload {
  file: File;
  type: 'id' | 'license' | 'certificate' | 'insurance' | 'other';
}

// Workflow Types
export interface VerificationWorkflow {
  step: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  currentAdmin?: string;
  estimatedCompletion?: string;
  nextActions: VerificationAction[];
}

export interface VerificationTemplate {
  id: string;
  name: string;
  description: string;
  documentTypes: DocumentType[];
  requirements: string[];
}