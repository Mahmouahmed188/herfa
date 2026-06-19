import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi } from '../services/api';
import type { 
  Ticket, 
  TicketDetail, 
  TicketListQuery, 
  TicketListResponse,
  Conversation,
  TicketStatusUpdate,
  TicketPriorityUpdate,
  TicketCategory,
  TicketStats,
  Dispute,
  DisputeDetail,
  DisputeListResponse
} from '../types';

// Ticket Management Hooks
export const useTickets = (query: TicketListQuery) => {
  return useQuery({
    queryKey: ['tickets', query.page, query.limit, query.status, query.priority, query.category, query.search],
    queryFn: () => supportApi.getTickets(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTicketDetail = (ticketId: string) => {
  return useQuery({
    queryKey: ['tickets', ticketId, 'detail'],
    queryFn: () => supportApi.getTicketDetail(ticketId),
    select: (response) => response.data,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTicketStats = () => {
  return useQuery({
    queryKey: ['tickets', 'stats'],
    queryFn: () => supportApi.getTicketStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTicketCategories = () => {
  return useQuery({
    queryKey: ['tickets', 'categories'],
    queryFn: () => supportApi.getTicketCategories(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Conversation Hooks
export const useTicketConversations = (ticketId: string) => {
  return useQuery({
    queryKey: ['tickets', ticketId, 'conversations'],
    queryFn: () => supportApi.getTicketConversations(ticketId),
    select: (response) => response.data,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTicketAttachments = (ticketId: string) => {
  return useQuery({
    queryKey: ['tickets', ticketId, 'attachments'],
    queryFn: () => supportApi.getTicketAttachments(ticketId),
    select: (response) => response.data,
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Dispute Management Hooks
export const useDisputes = (query: TicketListQuery) => {
  return useQuery({
    queryKey: ['disputes', query.page, query.limit, query.status, query.search],
    queryFn: () => supportApi.getDisputes(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDisputeDetail = (disputeId: string) => {
  return useQuery({
    queryKey: ['disputes', disputeId, 'detail'],
    queryFn: () => supportApi.getDisputeDetail(disputeId),
    select: (response) => response.data,
    enabled: !!disputeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDisputeEvidence = (disputeId: string) => {
  return useQuery({
    queryKey: ['disputes', disputeId, 'evidence'],
    queryFn: () => supportApi.getDisputeEvidence(disputeId),
    select: (response) => response.data,
    enabled: !!disputeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Agent Management Hooks
export const useAgents = () => {
  return useQuery({
    queryKey: ['support', 'agents'],
    queryFn: () => supportApi.getAgents(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAgentStats = (agentId: string) => {
  return useQuery({
    queryKey: ['support', 'agents', agentId, 'stats'],
    queryFn: () => supportApi.getAgentStats(agentId),
    select: (response) => response.data,
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Performance Metrics Hooks
export const useSupportPerformance = () => {
  return useQuery({
    queryKey: ['support', 'performance'],
    queryFn: () => supportApi.getSupportPerformance(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTicketResponseTime = () => {
  return useQuery({
    queryKey: ['support', 'response-time'],
    queryFn: () => supportApi.getTicketResponseTime(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: TicketStatusUpdate }) => 
      supportApi.updateTicketStatus(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'stats'] });
    },
  });
};

export const useUpdateTicketPriority = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: TicketPriorityUpdate }) => 
      supportApi.updateTicketPriority(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: { agentId: string; reason?: string } }) => 
      supportApi.assignTicket(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useReplyToTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: { message: string; attachments?: File[] } }) => 
      supportApi.replyToTicket(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'conversations'] });
    },
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { userId: string; subject: string; message: string; category?: string; priority?: string }) => 
      supportApi.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'stats'] });
    },
  });
};

export const useResolveDispute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ disputeId, data }: { disputeId: string; data: { resolution: string; amount?: number; notes?: string } }) => 
      supportApi.resolveDispute(disputeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
    },
  });
};

export const useBulkUpdateTickets = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Array<{ ticketId: string; action: 'assign' | 'close' | 'escalate'; agentId?: string; reason?: string }>) => 
      supportApi.bulkUpdateTickets(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'stats'] });
    },
  });
};

// Search Hooks
export const useSearchTickets = (filters: {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  dateRange?: string;
  userId?: string;
  providerId?: string;
}) => {
  return useQuery({
    queryKey: ['tickets', 'search', filters],
    queryFn: () => supportApi.searchTickets(filters),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSearchDisputes = (filters: {
  search?: string;
  status?: string;
  dateRange?: string;
  userId?: string;
  providerId?: string;
}) => {
  return useQuery({
    queryKey: ['disputes', 'search', filters],
    queryFn: () => supportApi.searchDisputes(filters),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Export Hooks
export const useExportTickets = () => {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'json'; filters?: any }) => 
      supportApi.exportTickets(format, filters),
  });
};

export const useExportDisputes = () => {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'json'; filters?: any }) => 
      supportApi.exportDisputes(format, filters),
  });
};

// Real-time Updates Hook
export const useRealtimeTicketUpdates = () => {
  return useQuery({
    queryKey: ['tickets', 'realtime'],
    queryFn: () => Promise.resolve({ updates: [] }), // Placeholder - implement WebSocket connection
    select: (response) => response.updates,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1 minute
  });
};