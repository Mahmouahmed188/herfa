'use client';

import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { StarRating } from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';
import { Review, ReviewDetail } from '../types';
import { ModerationBadge } from './ModerationBadge';

interface ReviewCardProps {
  review: Review | ReviewDetail;
  showCustomer?: boolean;
  showProvider?: boolean;
  className?: string;
}

export function ReviewCard({ review, showCustomer, showProvider, className }: ReviewCardProps) {
  const t = useTranslations('Reviews');
  const isModerated = !review.isApproved || review.isFlagged;

  if (isModerated) {
    return (
      <div className={cn('p-4 rounded-lg border border-muted bg-muted/30', className)}>
        <p className="text-sm text-muted-foreground italic">{t('hiddenReview')}</p>
      </div>
    );
  }

  return (
    <div className={cn('p-4 rounded-lg border bg-card', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm font-medium">{review.rating}.0</span>
          </div>
          <p className="text-sm text-foreground">{review.comment}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
        <time dateTime={review.createdAt}>
          {t('createdAt', { date: format(new Date(review.createdAt), 'MMM d, yyyy') })}
        </time>
        {review.updatedAt !== review.createdAt && (
          <time dateTime={review.updatedAt}>
            {t('updatedAt', { date: format(new Date(review.updatedAt), 'MMM d, yyyy') })}
          </time>
        )}
        {'customer' in review && review.customer && showCustomer && (
          <span>{t('byCustomer', { customer: review.customer.name })}</span>
        )}
        {'provider' in review && review.provider && showProvider && (
          <span>{t('reviewFor', { provider: review.provider.name })}</span>
        )}
        <ModerationBadge review={review} />
      </div>
    </div>
  );
}
