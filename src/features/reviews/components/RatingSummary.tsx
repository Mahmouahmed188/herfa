'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { RatingStats } from '../types';

interface RatingSummaryProps {
  stats?: RatingStats;
  isLoading?: boolean;
}

export function RatingSummary({ stats, isLoading }: RatingSummaryProps) {
  const t = useTranslations('Reviews');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('averageRating')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">{t('noProviderReviews')}</p>
        </CardContent>
      </Card>
    );
  }

  const distribution = stats.ratingDistribution || {};
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('averageRating')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</span>
          <div className="space-y-1">
            <StarRating rating={stats.averageRating} size="md" />
            <p className="text-sm text-muted-foreground">
              {t('totalReviews', { count: stats.totalReviews })}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{t('ratingDistribution')}</p>
          {Array.from({ length: 5 }, (_, i) => {
            const star = 5 - i;
            const count = distribution[star] || 0;
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 w-16">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {star}
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
