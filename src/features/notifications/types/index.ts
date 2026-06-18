import { BaseEntity } from '@/types/api';

export type CustomerNotificationType = 'BOOKING_UPDATE' | 'ANNOUNCEMENT' | 'PROMO' | 'SYSTEM';

export interface CustomerNotification extends BaseEntity {
  id: string;
  userId: string;
  type: CustomerNotificationType;
  title: string;
  body: string;
  isRead: boolean;
  metadata?: {
    bookingId?: string;
  };
}
