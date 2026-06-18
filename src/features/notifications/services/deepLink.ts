import { NotificationType, NotificationPayload } from '../types';

const BOOKING_TYPES = new Set([
  'BOOKING_CREATED', 'BOOKING_ACCEPTED', 'BOOKING_ASSIGNED',
  'BOOKING_STARTED', 'BOOKING_COMPLETED', 'BOOKING_CANCELLED', 'BOOKING_UPDATE',
]);

const TRACKING_TYPES = new Set([
  'TRACKING_STARTED', 'TRACKING_PAUSED', 'TRACKING_RESUMED', 'TRACKING_ARRIVED',
]);

const PAYMENT_TYPES = new Set([
  'PAYMENT_CREATED', 'PAYMENT_CONFIRMED',
  'REFUND_CREATED', 'REFUND_APPROVED', 'REFUND_REJECTED',
]);

const FINANCE_TYPES = new Set([
  'PAYMENT_CREATED',
  'PAYMENT_CONFIRMED',
  'REFUND_CREATED',
  'REFUND_APPROVED',
  'REFUND_REJECTED',
]);

const REVIEW_TYPES = new Set([
  'REVIEW_CREATED', 'REVIEW_UPDATED', 'REVIEW_MODERATED',
]);

const VERIFICATION_TYPES = new Set([
  'VERIFICATION_SUBMITTED', 'VERIFICATION_APPROVED',
  'VERIFICATION_REJECTED', 'VERIFICATION_SUSPENDED',
]);

const SUPPORT_TYPES = new Set([
  'TICKET_CREATED', 'TICKET_UPDATED', 'NEW_REPLY',
  'TICKET_RESOLVED', 'DISPUTE_UPDATED', 'DISPUTE_RESOLVED',
]);

export function getDeepLinkPath(type: NotificationType, data?: NotificationPayload | null): string | null {
  if (BOOKING_TYPES.has(type) && data?.bookingId) {
    return `/client/jobs/${data.bookingId}`;
  }

  if (TRACKING_TYPES.has(type) && data?.trackingId) {
    return `/client/tracking/${data.trackingId}`;
  }

  if (FINANCE_TYPES.has(type)) {
    return data?.paymentId ? `/finance/${data.paymentId}` : '/client/wallet';
  }

  if (REVIEW_TYPES.has(type) && data?.bookingId) {
    return `/client/jobs/${data.bookingId}#review`;
  }

  if (VERIFICATION_TYPES.has(type)) {
    return '/provider/verification';
  }

  if (SUPPORT_TYPES.has(type) && data?.ticketId) {
    return `/support/${data.ticketId}`;
  }

  if (type === 'ANNOUNCEMENT' && data?.announcementId) {
    return `/announcements/${data.announcementId}`;
  }

  if (data?.url) {
    return data.url;
  }

  return null;
}

export function isClickableNotification(type: NotificationType): boolean {
  return (
    BOOKING_TYPES.has(type) ||
    TRACKING_TYPES.has(type) ||
    PAYMENT_TYPES.has(type) ||
    REVIEW_TYPES.has(type) ||
    VERIFICATION_TYPES.has(type) ||
    SUPPORT_TYPES.has(type) ||
    type === 'ANNOUNCEMENT'
  );
}
