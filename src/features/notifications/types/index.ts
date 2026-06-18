export type CustomerNotificationType = 'BOOKING_UPDATE' | 'BOOKING_CREATED' | 'BOOKING_ACCEPTED' | 'BOOKING_ASSIGNED' | 'BOOKING_STARTED' | 'BOOKING_COMPLETED' | 'BOOKING_CANCELLED' | 'TRACKING_STARTED' | 'TRACKING_PAUSED' | 'TRACKING_RESUMED' | 'TRACKING_ARRIVED' | 'ANNOUNCEMENT' | 'PROMO' | 'SYSTEM';

export type VerificationNotificationType =
  | 'VERIFICATION_SUBMITTED'
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'
  | 'VERIFICATION_SUSPENDED'
  | 'DOCUMENTS_REQUESTED';

export type PaymentNotificationType =
  | 'PAYMENT_CREATED'
  | 'PAYMENT_CONFIRMED'
  | 'REFUND_CREATED'
  | 'REFUND_APPROVED'
  | 'REFUND_REJECTED';

export type ReviewNotificationType =
  | 'REVIEW_CREATED'
  | 'REVIEW_UPDATED'
  | 'REVIEW_MODERATED';

export type SupportNotificationType =
  | 'TICKET_CREATED'
  | 'TICKET_UPDATED'
  | 'NEW_REPLY'
  | 'TICKET_RESOLVED'
  | 'DISPUTE_UPDATED'
  | 'DISPUTE_RESOLVED';

export type NotificationType =
  | CustomerNotificationType
  | VerificationNotificationType
  | PaymentNotificationType
  | ReviewNotificationType
  | SupportNotificationType;

export interface NotificationPayload {
  bookingId?: string;
  paymentId?: string;
  reviewId?: string;
  trackingId?: string;
  verificationId?: string;
  ticketId?: string;
  disputeId?: string;
  announcementId?: string;
  url?: string;
}

export interface CustomerNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  channel?: string;
  data?: NotificationPayload;
  createdAt: string;
  updatedAt: string;
}
