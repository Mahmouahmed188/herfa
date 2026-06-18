import { useQueryClient } from '@tanstack/react-query';

export const REVIEW_NOTIFICATION_TYPES = [
  'review_created',
  'review_updated',
  'review_moderated',
] as const;

export type ReviewNotificationType = (typeof REVIEW_NOTIFICATION_TYPES)[number];

interface ReviewNotification {
  id: string;
  type: ReviewNotificationType;
  title: string;
  body: string;
  data?: {
    reviewId?: string;
    bookingId?: string;
    providerId?: string;
  };
  createdAt: string;
}

export function handleReviewNotification(
  queryClient: ReturnType<typeof useQueryClient>,
  notification: ReviewNotification
) {
  queryClient.invalidateQueries({ queryKey: ['reviews'] });

  if (notification.data?.reviewId) {
    queryClient.invalidateQueries({
      queryKey: ['reviews', 'detail', notification.data.reviewId],
    });
  }

  if (notification.data?.providerId) {
    queryClient.invalidateQueries({
      queryKey: ['reviews', 'statistics', notification.data.providerId],
    });
  }

  if (notification.data?.providerId) {
    queryClient.invalidateQueries({
      queryKey: ['reviews', 'provider', notification.data.providerId],
    });
  }
}

export function isReviewNotification(
  type: string
): type is ReviewNotificationType {
  return REVIEW_NOTIFICATION_TYPES.includes(type as ReviewNotificationType);
}
