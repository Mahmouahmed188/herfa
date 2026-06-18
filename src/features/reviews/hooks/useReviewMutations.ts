'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { reviewApi } from '../services/api';
import { ReviewCreateRequest, ReviewUpdateRequest } from '../types';

export function useCreateReview() {
  const queryClient = useQueryClient();
  const t = useTranslations('Reviews.errors');

  return useMutation({
    mutationFn: (data: ReviewCreateRequest) => reviewApi.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(t('submitSucceed') || 'Review submitted successfully');
    },
    onError: () => {
      toast.error(t('submitFailed'));
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  const t = useTranslations('Reviews.errors');

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewUpdateRequest }) =>
      reviewApi.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(t('updateSucceed') || 'Review updated successfully');
    },
    onError: () => {
      toast.error(t('updateFailed'));
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  const t = useTranslations('Reviews.errors');

  return useMutation({
    mutationFn: (id: string) => reviewApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success(t('deleteSucceed') || 'Review deleted successfully');
    },
    onError: () => {
      toast.error(t('deleteFailed'));
    },
  });
}

export function useFlagReview() {
  const queryClient = useQueryClient();
  const t = useTranslations('Reviews');

  return useMutation({
    mutationFn: (id: string) => reviewApi.flagReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success(t('reviewFlagged'));
    },
    onError: () => {
      toast.error(t('flagFailed'));
    },
  });
}
