import { z } from 'zod';

// Basic User Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string(),
  role: z.enum(['client', 'technician', 'admin']),
  status: z.enum(['active', 'suspended', 'pending', 'banned']),
  registrationDate: z.string(),
  lastLogin: z.string().nullable(),
});

// User Profile Schema
export const UserProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }).nullable(),
  preferences: z.object({
    language: z.enum(['en', 'ar']),
    notifications: z.boolean(),
    theme: z.enum(['light', 'dark']),
  }),
  verification: z.object({
    status: z.enum(['pending', 'approved', 'rejected']),
    documents: z.array(z.object({
      id: z.string(),
      type: z.enum(['id', 'license', 'certificate', 'insurance', 'other']),
      url: z.string(),
      filename: z.string(),
      uploadedAt: z.string(),
      status: z.enum(['pending', 'approved', 'rejected']),
    })),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// User Booking History Schema
export const UserBookingSchema = z.object({
  id: z.string(),
  service: z.string(),
  provider: z.string(),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed']),
  scheduledDate: z.string(),
  totalAmount: z.number(),
});

// User Activity Summary Schema
export const UserActivitySummarySchema = z.object({
  totalBookings: z.number(),
  totalSpent: z.number(),
  lastActivity: z.string(),
});

// Complete User Details Schema
export const UserDetailSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string(),
  role: z.enum(['client', 'technician', 'admin']),
  status: z.enum(['active', 'suspended', 'pending', 'banned']),
  registrationDate: z.string(),
  lastLogin: z.string().nullable(),
  profile: UserProfileSchema,
  bookingHistory: z.array(UserBookingSchema),
  activitySummary: UserActivitySummarySchema,
});

// User List Query Schema
export const UserListQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.enum(['client', 'technician', 'admin']).optional(),
  status: z.enum(['active', 'suspended', 'pending', 'banned']).optional(),
});

// User List Response Schema
export const UserListResponseSchema = z.object({
  users: z.array(UserSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// User Status Update Schema
export const UserStatusUpdateSchema = z.object({
  status: z.enum(['suspended', 'reactivated']),
  reason: z.string().optional(),
});

// Export all schemas
export const UserSchemas = {
  base: UserSchema,
  profile: UserProfileSchema,
  booking: UserBookingSchema,
  activity: UserActivitySummarySchema,
  detail: UserDetailSchema,
  listQuery: UserListQuerySchema,
  listResponse: UserListResponseSchema,
  statusUpdate: UserStatusUpdateSchema,
};