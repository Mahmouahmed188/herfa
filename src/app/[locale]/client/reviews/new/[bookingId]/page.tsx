'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewForm } from '@/features/reviews/components/ReviewForm';
import { useCreateReview } from '@/features/reviews/hooks/useReviewMutations';
import { useBookingDetail } from '@/features/bookings/hooks/useBookingDetail';

export default function CreateReviewPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('Reviews');
  const bookingId = params.bookingId as string;
  const { data: booking, isLoading, isError } = useBookingDetail(bookingId);
  const createReview = useCreateReview();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{t('errors.notFound')}</p>
        <Link href="/client/jobs">
          <Button variant="outline" className="mt-4">{t('viewDetails')}</Button>
        </Link>
      </div>
    );
  }

  if (booking.status !== 'COMPLETED') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('errors.notFound')}</p>
        <Link href={{ pathname: '/client/jobs/[id]', params: { id: bookingId } }}>
          <Button variant="outline" className="mt-4">{t('viewDetails')}</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    await createReview.mutateAsync({
      bookingId,
      providerId: booking.provider?.id || '',
      rating: data.rating,
      comment: data.comment,
    });
    router.push(`/client/jobs/${bookingId}`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={{ pathname: '/client/jobs/[id]', params: { id: bookingId } }}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{t('writeReview')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t('reviewFor', { provider: booking.provider?.name || '' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewForm
            onSubmit={handleSubmit}
            isSubmitting={createReview.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
