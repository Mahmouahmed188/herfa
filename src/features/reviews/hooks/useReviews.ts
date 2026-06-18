'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewApi } from '../services/api';
import { ReviewFilters, AdminReviewFilters } from '../types';

export function useReviewList(params?: ReviewFilters) {
  return useQuery({
    queryKey: ['reviews', 'list', params],
    queryFn: () => reviewApi.getCustomerReviews(params),
  });
}

export function useProviderReviewList(providerId?: string, params?: ReviewFilters) {
  return useQuery({
    queryKey: ['reviews', 'provider', providerId, params],
    queryFn: () => reviewApi.getProviderReviews(params),
    enabled: !!providerId,
  });
}

export function useReviewDetail(id?: string) {
  return useQuery({
    queryKey: ['reviews', 'detail', id],
    queryFn: () => reviewApi.getReviewDetail(id!),
    enabled: !!id,
  });
}

export function usePublicProviderReviews(providerId?: string, params?: ReviewFilters) {
  return useQuery({
    queryKey: ['reviews', 'public', providerId, params],
    queryFn: () => reviewApi.getProviderPublicReviews(providerId!, params),
    enabled: !!providerId,
  });
}

export function useAdminReviewList(params?: AdminReviewFilters) {
  return useQuery({
    queryKey: ['reviews', 'admin', params],
    queryFn: () => reviewApi.getAdminReviews(params),
  });
}
