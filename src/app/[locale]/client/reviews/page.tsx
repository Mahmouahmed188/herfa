'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useReviewList } from '@/features/reviews/hooks/useReviews';
import { ReviewList } from '@/features/reviews/components/ReviewList';
import { ReviewFilters } from '@/features/reviews/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CustomerReviewsPage() {
  const t = useTranslations('Reviews');

  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const { data, isLoading, isError, refetch } = useReviewList(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('myReviews')}</h1>
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
        reviews={data?.data}
        total={data?.meta?.total}
        page={filters.page}
        totalPages={data?.meta?.totalPages}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        emptyTitle={t('noReviews')}
        emptyAction={t('noReviewsDesc')}
        showProvider
      />
    </div>
  );
}
