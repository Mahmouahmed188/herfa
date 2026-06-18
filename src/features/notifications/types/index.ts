import { BaseEntity } from '@/types/api';

export type CustomerNotificationType = 'BOOKING_UPDATE' | 'BOOKING_CREATED' | 'BOOKING_ACCEPTED' | 'BOOKING_ASSIGNED' | 'BOOKING_STARTED' | 'BOOKING_COMPLETED' | 'BOOKING_CANCELLED' | 'ANNOUNCEMENT' | 'PROMO' | 'SYSTEM';

export type VerificationNotificationType =
  | 'VERIFICATION_SUBMITTED'
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'
  | 'VERIFICATION_SUSPENDED'
  | 'DOCUMENTS_REQUESTED';

export type NotificationType = CustomerNotificationType | VerificationNotificationType;

export interface CustomerNotification extends BaseEntity {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  metadata?: {
    bookingId?: string;
    verificationId?: string;
  };
}
