'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewCard } from '@/features/reviews/components/ReviewCard';
import { useReviewDetail } from '@/features/reviews/hooks/useReviews';

export default function ProviderReviewDetailPage() {
  const params = useParams();
  const t = useTranslations('Reviews');
  const reviewId = params.reviewId as string;

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
        <Link href="/technician/reviews">
          <Button variant="outline" className="mt-4">{t('dashboard.viewAll')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link href="/technician/reviews">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>

      <Card>
        <CardContent className="pt-6">
          <ReviewCard review={reviewRes.data} showCustomer />
        </CardContent>
      </Card>
    </div>
  );
}
