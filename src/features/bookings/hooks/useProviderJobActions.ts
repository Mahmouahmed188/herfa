'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../services/api';
import { toast } from 'sonner';

export function useAcceptJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, quotedPrice }: { assignmentId: string; quotedPrice?: number }) =>
      bookingApi.acceptJob(assignmentId, quotedPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'assigned'] });
      toast.success('Job accepted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.error?.message || error?.message || 'Failed to accept job');
    },
  });
}

export function useRejectJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, reason }: { assignmentId: string; reason?: string }) =>
      bookingApi.rejectJob(assignmentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'assigned'] });
      toast.success('Job rejected');
    },
    onError: (error: any) => {
      toast.error(error?.error?.message || error?.message || 'Failed to reject job');
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'ON_THE_WAY' | 'IN_PROGRESS' | 'COMPLETED' }) =>
      bookingApi.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'assigned'] });
      toast.success('Job status updated');
    },
    onError: (error: any) => {
      toast.error(error?.error?.message || error?.message || 'Failed to update job status');
    },
  });
}