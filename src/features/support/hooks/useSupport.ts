import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi, CreateSupportTicketInput } from '../services/api';
import { toast } from 'sonner';

export function useTickets(params?: { page?: number; status?: string; priority?: string }) {
  return useQuery({
    queryKey: ['support', 'tickets', params],
    queryFn: () => supportApi.getTickets(params),
  });
}

export function useTicketDetails(id: string) {
  return useQuery({
    queryKey: ['support', 'tickets', id],
    queryFn: () => supportApi.getTicketDetails(id),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupportTicketInput) => supportApi.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
      toast.success('Request submitted');
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; status: string; note?: string }) =>
      supportApi.updateTicketStatus(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support'] });
      toast.success('Ticket status updated');
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; userId: string }) =>
      supportApi.assignTicket(data.id, data.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support'] });
      toast.success('Ticket assigned');
    },
  });
}

export function useEscalateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; reason: string }) =>
      supportApi.escalateTicket(data.id, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support'] });
      toast.success('Ticket escalated');
    },
  });
}

export function useReviews(params?: { page?: number; status?: string }) {
  return useQuery({
    queryKey: ['support', 'reviews', params],
    queryFn: () => supportApi.getReviews(params),
  });
}

export function useModerateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; action: 'APPROVED' | 'REJECTED' | 'FLAGGED'; reason?: string }) =>
      supportApi.moderateReview(data.id, data.action, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'reviews'] });
      toast.success('Review moderated');
    },
  });
}

export function useContentReports(params?: { page?: number; status?: string }) {
  return useQuery({
    queryKey: ['support', 'reports', params],
    queryFn: () => supportApi.getContentReports(params),
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; resolution: string; action: 'RESOLVED' | 'DISMISSED' }) =>
      supportApi.resolveReport(data.id, data.resolution, data.action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'reports'] });
      toast.success('Report resolved');
    },
  });
}
