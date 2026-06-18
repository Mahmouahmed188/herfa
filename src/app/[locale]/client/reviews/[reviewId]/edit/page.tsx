'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewForm } from '@/features/reviews/components/ReviewForm';
import { useReviewDetail } from '@/features/reviews/hooks/useReviews';
import { useUpdateReview } from '@/features/reviews/hooks/useReviewMutations';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export default function EditReviewPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('Reviews');
  const reviewId = params.reviewId as string;
  const user = useAuthStore((s) => s.user);

  const { data: reviewRes, isLoading, isError } = useReviewDetail(reviewId);
  const updateReview = useUpdateReview();

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

  if (review.customerId !== user?.id) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{t('errors.notOwner')}</p>
        <Link href="/client/reviews">
          <Button variant="outline" className="mt-4">{t('myReviews')}</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    await updateReview.mutateAsync({ id: reviewId, data });
    router.push(`/client/reviews/${reviewId}`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={{ pathname: '/client/reviews/[reviewId]', params: { reviewId } }}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{t('editReview')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('editReview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewForm
            initialData={review}
            onSubmit={handleSubmit}
            isSubmitting={updateReview.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
