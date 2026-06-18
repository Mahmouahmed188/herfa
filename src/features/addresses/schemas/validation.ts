import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1).max(50),
  street: z.string().min(1).max(200),
  building: z.string().max(200).optional().or(z.literal('')),
  city: z.string().min(1).max(100),
  area: z.string().min(1).max(100),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().default(false),
  phone: z
    .string()
    .regex(/^05\d{8}$/, 'Phone must be a valid Saudi number (05xxxxxxxx)')
    .optional()
    .or(z.literal('')),
  additionalInstructions: z.string().max(500).optional().or(z.literal('')),
});

export type AddressFormData = z.infer<typeof addressSchema>;
