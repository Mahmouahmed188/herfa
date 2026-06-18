// Support Management Types

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface SupportMessage {
  id: string;
  userId: string | null;
  adminId: string | null;
  content: string;
  type: 'user' | 'admin' | 'system';
  attachments: Attachment[];
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  providerId: string | null;
  bookingId: string | null;
  subject: string;
  category: 'technical' | 'billing' | 'booking' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface SupportTicketDetail {
  id: string;
  userId: string;
  providerId: string | null;
  bookingId: string | null;
  subject: string;
  category: 'technical' | 'billing' | 'booking' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  conversation: SupportMessage[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  provider: {
    id: string;
    name: string;
    email: string;
  } | null;
  booking: {
    id: string;
    service: string;
    scheduledDate: string;
    scheduledTime: string;
  } | null;
}

export interface SupportTicketQuery {
  page: number;
  limit: number;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'technical' | 'billing' | 'booking' | 'account' | 'other';
  assignee?: string;
}

export interface SupportTicketListResponse {
  tickets: SupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TicketAssignment {
  assigneeId: string;
}

export interface TicketReply {
  content: string;
  attachments?: Attachment[];
}

export interface TicketStatusUpdate {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  notes?: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  reason: 'service_quality' | 'payment_issue' | 'no_show' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface DisputeEvidence {
  id: string;
  type: 'photo' | 'document' | 'message' | 'other';
  url: string;
  description: string;
  uploadedAt: string;
}

export interface DisputeHistory {
  id: string;
  action: 'filed' | 'reviewed' | 'resolved' | 'closed';
  adminId: string | null;
  notes: string | null;
  timestamp: string;
}

export interface DisputeDetail {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  reason: 'service_quality' | 'payment_issue' | 'no_show' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  participants: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    provider: {
      id: string;
      name: string;
      email: string;
    };
  };
  evidence: DisputeEvidence[];
  history: DisputeHistory[];
}

export interface DisputeQuery {
  page: number;
  limit: number;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  reason?: 'service_quality' | 'payment_issue' | 'no_show' | 'other';
}

export interface DisputeListResponse {
  disputes: Dispute[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DisputeResolution {
  resolution: string;
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
export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  pendingDisputes: number;
  resolvedDisputes: number;
}

export interface TicketByCategory {
  category: 'technical' | 'billing' | 'booking' | 'account' | 'other';
  count: number;
  percentage: number;
}

export interface TicketByPriority {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  count: number;
  percentage: number;
}

export interface RecentTicket {
  id: string;
  subject: string;
  user: string;
  status: string;
  createdAt: string;
}

// Form Types
export interface TicketFormData {
  subject: string;
  category: 'technical' | 'billing' | 'booking' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  content: string;
  attachments?: File[];
}

export interface DisputeFormData {
  reason: 'service_quality' | 'payment_issue' | 'no_show' | 'other';
  description: string;
  evidence?: File[];
}

// Error Types
export interface SupportError {
  code: string;
  message: string;
  details?: string;
}

// Loading States
export interface SupportLoadingState {
  isLoading: boolean;
  isUpdating: boolean;
  isReplying: boolean;
  isAssigning: boolean;
  isResolving: boolean;
}