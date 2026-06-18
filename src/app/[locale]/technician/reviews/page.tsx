'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useProviderReviewList } from '@/features/reviews/hooks/useReviews';
import { useProviderRatingStats } from '@/features/reviews/hooks/useRatingStats';
import { RatingSummary } from '@/features/reviews/components/RatingSummary';
import { ReviewList } from '@/features/reviews/components/ReviewList';
import { ReviewFilters } from '@/features/reviews/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProviderReviewsPage() {
  const t = useTranslations('Reviews');
  const user = useAuthStore((s) => s.user);
  const providerId = user?.id;

  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const { data: reviewsRes, isLoading, isError, refetch } = useProviderReviewList(providerId, filters);
  const { data: statsRes, isLoading: statsLoading } = useProviderRatingStats(providerId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.title')}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <RatingSummary stats={statsRes?.data} isLoading={statsLoading} />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Select
              value={filters.sortBy}
              onValueChange={(val) => setFilters((f) => ({ ...f, sortBy: val as 'createdAt' | 'rating', page: 1 }))}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t('sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">{t('newest')}</SelectItem>
                <SelectItem value="rating">{t('highestRating')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ReviewList
            reviews={reviewsRes?.data}
            total={reviewsRes?.meta?.total}
            page={filters.page}
            totalPages={reviewsRes?.meta?.totalPages}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            emptyTitle={t('noProviderReviews')}
            showCustomer
          />
        </div>
      </div>
    </div>
  );
}
