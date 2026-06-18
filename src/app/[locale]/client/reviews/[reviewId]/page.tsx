'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader2, ArrowLeft, Pencil } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewCard } from '@/features/reviews/components/ReviewCard';
import { useReviewDetail } from '@/features/reviews/hooks/useReviews';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export default function CustomerReviewDetailPage() {
  const params = useParams();
  const t = useTranslations('Reviews');
  const reviewId = params.reviewId as string;
  const user = useAuthStore((s) => s.user);

  const { data: reviewRes, isLoading, isError } = useReviewDetail(reviewId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !reviewRes?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{t('errors.notFound')}</p>
        <Link href="/client/reviews">
          <Button variant="outline" className="mt-4">{t('myReviews')}</Button>
        </Link>
      </div>
    );
  }

  const review = reviewRes.data;
  const isOwner = review.customerId === user?.id;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/client/reviews">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        {isOwner && (
          <Link href={{ pathname: '/client/reviews/[reviewId]/edit', params: { reviewId } }}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" /> {t('editReview')}
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <ReviewCard review={review} showProvider />
        </CardContent>
      </Card>
    </div>
  );
}
