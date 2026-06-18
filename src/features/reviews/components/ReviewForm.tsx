'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { reviewCreateSchema, reviewUpdateSchema, ReviewCreateFormData, ReviewUpdateFormData } from '../schemas/validation';
import { StarRatingInput } from './StarRating';
import { Review } from '../types';

interface ReviewFormProps {
  initialData?: Review;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

export function ReviewForm({ initialData, onSubmit, isSubmitting }: ReviewFormProps) {
  const t = useTranslations('Reviews');
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewCreateFormData | ReviewUpdateFormData>({
    resolver: zodResolver(isEdit ? reviewUpdateSchema : reviewCreateSchema),
    defaultValues: initialData
      ? { rating: initialData.rating, comment: initialData.comment || '' }
      : { rating: 0, comment: '' },
  });

  const currentRating = watch('rating');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <StarRatingInput
          label={`${t('rating')} *`}
          value={typeof currentRating === 'number' ? currentRating : 0}
          onChange={(val) => setValue('rating', val, { shouldValidate: true })}
          error={errors.rating?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">{t('comment')}</Label>
        <textarea
          id="comment"
          rows={4}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={t('commentPlaceholder')}
          {...register('comment')}
        />
        {errors.comment && (
          <p className="text-sm text-destructive">{errors.comment.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || !currentRating} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEdit ? t('updatingReview') : t('submittingReview')}
      </Button>
    </form>
  );
}
