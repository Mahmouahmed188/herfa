import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['CUSTOMER', 'PROVIDER']),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }).optional(),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }).optional(),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }).optional(),
  avatarUrl: z.string().url({ message: 'Invalid URL' }).optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
