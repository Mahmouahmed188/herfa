'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewCard } from './ReviewCard';
import type { Review, ReviewDetail } from '../types';

interface ReviewListProps {
  reviews?: (Review | ReviewDetail)[];
  total?: number;
  page?: number;
  totalPages?: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyAction?: string;
  showCustomer?: boolean;
  showProvider?: boolean;
}

export function ReviewList({
  reviews,
  total,
  page = 1,
  totalPages = 1,
  isLoading,
  isError,
  onRetry,
  onPageChange,
  emptyTitle,
  emptyAction,
  showCustomer,
  showProvider,
}: ReviewListProps) {
  const t = useTranslations('Reviews');

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="animate-pulse p-4 rounded-lg border">
            <div className="h-4 w-24 bg-muted rounded mb-3" />
            <div className="h-3 w-full bg-muted rounded mb-2" />
            <div className="h-3 w-3/4 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{t('errors.loadFailed')}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyTitle || t('noReviews')}</p>
        {emptyAction && <p className="text-sm text-muted-foreground mt-1">{emptyAction}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {total !== undefined && (
        <p className="text-sm text-muted-foreground">
          {t('totalReviews', { count: total })}
        </p>
      )}
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showCustomer={showCustomer}
            showProvider={showProvider}
          />
        ))}
      </div>
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
