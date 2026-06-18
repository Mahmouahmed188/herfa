import { z } from 'zod';

export const notificationTypeSchema = z.enum(['BOOKING_UPDATE', 'ANNOUNCEMENT', 'PROMO', 'SYSTEM']);

export const customerNotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  body: z.string(),
  isRead: z.boolean(),
  metadata: z
    .object({
      bookingId: z.string().optional(),
    })
    .nullable()
    .optional(),
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
