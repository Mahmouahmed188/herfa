'use client';

import { useQuery } from '@tanstack/react-query';
import { getProviderRatingStats } from '../services/api';

export function useProviderRatingStats(providerId?: string) {
  return useQuery({
    queryKey: ['reviews', 'statistics', providerId],
    queryFn: () => getProviderRatingStats(providerId!),
    enabled: !!providerId,
  });
}
