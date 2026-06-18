import { z } from 'zod';

export const serviceInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
});

export const providerInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  rating: z.number().optional(),
});

export const paymentInfoSchema = z.object({
  status: z.enum(['PAID', 'UNPAID', 'REFUNDED']),
  method: z.string().optional(),
  paidAt: z.string().optional(),
});

export const trackingInfoSchema = z.object({
  available: z.boolean(),
  eta: z.string().optional(),
  providerLatitude: z.number().optional(),
  providerLongitude: z.number().optional(),
  lastUpdated: z.string().optional(),
});

export const trackingSessionSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'NOT_STARTED']),
  providerLatitude: z.number().min(-90).max(90).nullable().optional(),
  providerLongitude: z.number().min(-180).max(180).nullable().optional(),
  eta: z.string().datetime().nullable().optional(),
  lastUpdated: z.string().datetime().nullable().optional(),
  startedAt: z.string().datetime().nullable().optional(),
  endedAt: z.string().datetime().nullable().optional(),
});

export const timelineEventSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  note: z.string().optional(),
});

export const customerBookingSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'ASSIGNED', 'IN_PROGRESS', 'ON_THE_WAY', 'COMPLETED', 'CANCELLED', 'DISPUTED']),
  service: serviceInfoSchema,
  provider: providerInfoSchema.nullable().optional(),
  address: z.string().optional(),
  scheduledAt: z.string().optional(),
  amount: z.number().optional(),
  payment: paymentInfoSchema.nullable().optional(),
  tracking: trackingInfoSchema.nullable().optional(),
  timeline: z.array(timelineEventSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CustomerBookingSchema = z.infer<typeof customerBookingSchema>;
