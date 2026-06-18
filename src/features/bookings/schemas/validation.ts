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

export const timelineEventSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  note: z.string().optional(),
});

export const customerBookingSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED']),
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
