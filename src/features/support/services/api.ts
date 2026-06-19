import { api } from '@/lib/axios';
import { SupportSchemas } from '../schemas';
import type { 
  SupportTicket, 
  SupportTicketDetail, 
  SupportTicketQuery, 
  SupportTicketListResponse,
  TicketAssignment,
  TicketReply,
  TicketStatusUpdate,
  Dispute,
  DisputeDetail,
  DisputeQuery,
  DisputeListResponse,
  DisputeResolution
} from '../types';

export const supportApi = {
  // Ticket Management
  /**
   * Get paginated list of support tickets
   */
  getTickets: async (query: SupportTicketQuery) => {
    const params = {
      page: query.page,
      limit: query.limit,
      ...(query.status && { status: query.status }),
      ...(query.priority && { priority: query.priority }),
      ...(query.category && { category: query.category }),
      ...(query.assignee && { assignee: query.assignee }),
    };

    const response = await api.get('/admin/support/tickets', { params });
    return SupportSchemas.listResponse.parse(response.data);
  },

  /**
   * Get detailed ticket information
   */
  getTicketDetail: async (ticketId: string) => {
    const response = await api.get(`/admin/support/tickets/${ticketId}`);
    return SupportSchemas.detail.parse(response.data);
  },

  /**
   * Assign a ticket to an admin
   */
  assignTicket: async (ticketId: string, data: TicketAssignment) => {
    const response = await api.post(`/admin/support/tickets/${ticketId}/assign`, data);
    return response.data;
  },

  /**
   * Reply to a support ticket
   */
  replyToTicket: async (ticketId: string, data: TicketReply) => {
    const response = await api.post(`/admin/support/tickets/${ticketId}/reply`, data);
    return response.data;
  },

  /**
   * Update ticket status
   */
  updateTicketStatus: async (ticketId: string, data: TicketStatusUpdate) => {
    const response = await api.post(`/admin/support/tickets/${ticketId}/update-status`, data);
    return response.data;
  },

  /**
   * Get ticket statistics
   */
  getTicketStats: async () => {
    const response = await api.get('/admin/support/tickets/stats');
    return response.data;
  },

  /**
   * Get ticket by category
   */
  getTicketsByCategory: async (category: string) => {
    const response = await api.get(`/admin/support/tickets/category/${category}`);
    return response.data;
  },

  /**
   * Get ticket by priority
   */
  getTicketsByPriority: async (priority: string) => {
    const response = await api.get(`/admin/support/tickets/priority/${priority}`);
    return response.data;
  },

  /**
   * Search tickets
   */
  searchTickets: async (query: {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    assignee?: string;
    dateRange?: string;
  }) => {
    const response = await api.get('/admin/support/tickets/search', { params: query });
    return response.data;
  },

  /**
   * Export tickets
   */
  exportTickets: async (format: 'csv' | 'excel' | 'json', filters?: any) => {
    const params = { format, ...filters };
    const response = await api.get('/admin/support/tickets/export', { params });
    return response.data;
  },

  // Dispute Management
  /**
   * Get paginated list of disputes
   */
  getDisputes: async (query: DisputeQuery) => {
    const params = {
      page: query.page,
      limit: query.limit,
      ...(query.status && { status: query.status }),
      ...(query.reason && { reason: query.reason }),
    };

    const response = await api.get('/admin/support/disputes', { params });
    return SupportSchemas.disputeListResponse.parse(response.data);
  },

  /**
   * Get detailed dispute information
   */
  getDisputeDetail: async (disputeId: string) => {
    const response = await api.get(`/admin/support/disputes/${disputeId}`);
    return SupportSchemas.disputeDetail.parse(response.data);
  },

  /**
   * Resolve a dispute
   */
  resolveDispute: async (disputeId: string, data: DisputeResolution) => {
    const response = await api.post(`/admin/support/disputes/${disputeId}/resolve`, data);
    return response.data;
  },

  /**
   * Get dispute statistics
   */
  getDisputeStats: async () => {
    const response = await api.get('/admin/support/disputes/stats');
    return response.data;
  },

  /**
   * Get dispute by reason
   */
  getDisputesByReason: async (reason: string) => {
    const response = await api.get(`/admin/support/disputes/reason/${reason}`);
    return response.data;
  },

  /**
   * Search disputes
   */
  searchDisputes: async (query: {
    search?: string;
    status?: string;
    reason?: string;
    dateRange?: string;
  }) => {
    const response = await api.get('/admin/support/disputes/search', { params: query });
    return response.data;
  },

  /**
   * Export disputes
   */
  exportDisputes: async (format: 'csv' | 'excel' | 'json', filters?: any) => {
    const params = { format, ...filters };
    const response = await api.get('/admin/support/disputes/export', { params });
    return response.data;
  },

  // Conversation Management
  /**
   * Get ticket conversation
   */
  getTicketConversation: async (ticketId: string) => {
    const response = await api.get(`/admin/support/tickets/${ticketId}/conversation`);
    return response.data;
  },

  /**
   * Add message to conversation
   */
  addConversationMessage: async (ticketId: string, data: TicketReply) => {
    const response = await api.post(`/admin/support/tickets/${ticketId}/conversation`, data);
    return response.data;
  },

  /**
   * Get conversation attachments
   */
  getConversationAttachments: async (messageId: string) => {
    const response = await api.get(`/admin/support/messages/${messageId}/attachments`);
    return response.data;
  },

  // Admin Assignment
  /**
   * Get assigned tickets for current admin
   */
  getMyTickets: async (page = 1, limit = 20) => {
    const params = { page, limit };
    const response = await api.get('/admin/support/my-tickets', { params });
    return response.data;
  },

  /**
   * Get available admins for assignment
   */
  getAvailableAdmins: async () => {
    const response = await api.get('/admin/support/available-admins');
    return response.data;
  },
};