import { z } from 'zod';

export const notificationTypeSchema = z.enum([
  'BOOKING_UPDATE',
  'BOOKING_CREATED',
  'BOOKING_ACCEPTED',
  'BOOKING_ASSIGNED',
  'BOOKING_STARTED',
  'BOOKING_COMPLETED',
  'BOOKING_CANCELLED',
  'TRACKING_STARTED',
  'TRACKING_PAUSED',
  'TRACKING_RESUMED',
  'TRACKING_ARRIVED',
  'ANNOUNCEMENT',
  'PROMO',
  'SYSTEM',
  'VERIFICATION_SUBMITTED',
  'VERIFICATION_APPROVED',
  'VERIFICATION_REJECTED',
  'VERIFICATION_SUSPENDED',
  'DOCUMENTS_REQUESTED',
  'PAYMENT_CREATED',
  'PAYMENT_CONFIRMED',
  'REFUND_CREATED',
  'REFUND_APPROVED',
  'REFUND_REJECTED',
  'REVIEW_CREATED',
  'REVIEW_UPDATED',
  'REVIEW_MODERATED',
  'TICKET_CREATED',
  'TICKET_UPDATED',
  'NEW_REPLY',
  'TICKET_RESOLVED',
  'DISPUTE_UPDATED',
  'DISPUTE_RESOLVED',
]);

export const notificationPayloadSchema = z.object({
  bookingId: z.string().optional(),
  paymentId: z.string().optional(),
  reviewId: z.string().optional(),
  trackingId: z.string().optional(),
  verificationId: z.string().optional(),
  ticketId: z.string().optional(),
  disputeId: z.string().optional(),
  announcementId: z.string().optional(),
  url: z.string().optional(),
});

export const customerNotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  body: z.string(),
  isRead: z.boolean(),
  channel: z.string().optional(),
  data: notificationPayloadSchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedNotificationsSchema = z.object({
  data: z.array(customerNotificationSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const unreadCountSchema = z.object({
  count: z.number(),
});

export type CustomerNotificationSchemaType = z.infer<typeof customerNotificationSchema>;
export type PaginatedNotificationsType = z.infer<typeof paginatedNotificationsSchema>;
export type UnreadCountType = z.infer<typeof unreadCountSchema>;
