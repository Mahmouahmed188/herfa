'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingSummary } from './RatingSummary';
import { ReviewList } from './ReviewList';
import { RatingStats, Review } from '../types';

interface ReviewDashboardProps {
  stats?: RatingStats;
  recentReviews?: Review[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function ReviewDashboard({ stats, recentReviews, isLoading, isError, onRetry }: ReviewDashboardProps) {
  const t = useTranslations('Reviews.dashboard');

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <RatingSummary stats={stats} isLoading={isLoading} />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('recentReviews')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewList
              reviews={recentReviews}
              isLoading={isLoading}
              isError={isError}
              onRetry={onRetry}
              showCustomer
              emptyTitle={t('recentReviews')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
