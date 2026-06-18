import { z } from 'zod';

export const reviewCreateSchema = z.object({
  bookingId: z.string().uuid(),
  providerId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export const reviewUpdateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(2000).optional(),
});

export type ReviewCreateFormData = z.infer<typeof reviewCreateSchema>;
export type ReviewUpdateFormData = z.infer<typeof reviewUpdateSchema>;
