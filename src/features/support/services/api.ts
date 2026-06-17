import { api } from '@/lib/axios';
import { ApiResponse, PaginatedResponse, BaseEntity } from '@/types/api';

export interface SupportTicket extends BaseEntity {
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL' | 'DISPUTE';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  assignedTo?: { id: string; name: string };
  createdBy: { id: string; name: string };
  escalationLevel: number;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isInternal: boolean;
}

export interface ReviewItem extends BaseEntity {
  bookingId: string;
  reviewer: string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  reportedBy?: string;
  reason?: string;
}

export interface ContentReport extends BaseEntity {
  contentType: 'REVIEW' | 'LISTING' | 'IMAGE' | 'PROFILE';
  contentId: string;
  reportedBy: { id: string; name: string };
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  resolvedBy?: string;
  resolution?: string;
}

export const supportApi = {
  getTickets: async (params?: { page?: number; limit?: number; status?: string; priority?: string }) => {
    const response = await api.get<PaginatedResponse<SupportTicket>>('/support/tickets', { params });
    return response.data;
  },

  getTicketDetails: async (id: string) => {
    const response = await api.get<ApiResponse<SupportTicket>>(`/support/tickets/${id}`);
    return response.data;
  },

  updateTicketStatus: async (id: string, data: { status: string; note?: string }) => {
    const response = await api.patch<ApiResponse<SupportTicket>>(`/support/tickets/${id}/status`, data);
    return response.data;
  },

  assignTicket: async (id: string, userId: string) => {
    const response = await api.post<ApiResponse<SupportTicket>>(`/support/tickets/${id}/assign`, { userId });
    return response.data;
  },

  escalateTicket: async (id: string, reason: string) => {
    const response = await api.post<ApiResponse<SupportTicket>>(`/support/tickets/${id}/escalate`, { reason });
    return response.data;
  },

  getReviews: async (params?: { page?: number; status?: string }) => {
    const response = await api.get<PaginatedResponse<ReviewItem>>('/admin/reviews', { params });
    return response.data;
  },

  moderateReview: async (id: string, action: 'APPROVED' | 'REJECTED' | 'FLAGGED', reason?: string) => {
    const response = await api.delete<ApiResponse<ReviewItem>>(`/admin/reviews/${id}`, { data: { action, reason } });
    return response.data;
  },

  getContentReports: async (params?: { page?: number; status?: string }) => {
    const response = await api.get<PaginatedResponse<ContentReport>>('/support/content-reports', { params });
    return response.data;
  },

  resolveReport: async (id: string, resolution: string, action: 'RESOLVED' | 'DISMISSED') => {
    const response = await api.post<ApiResponse<ContentReport>>(`/support/content-reports/${id}/resolve`, { resolution, action });
    return response.data;
  },
};
