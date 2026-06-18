import { z } from 'zod';
import { api } from '@/lib/axios';
import { ApiResponse, BaseEntity } from '@/types/api';

export interface Booking extends BaseEntity {
  id: string;
  userId: string;
  userName: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  status: 'PENDING' | 'ACCEPTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'ON_THE_WAY' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  amount: number;
  scheduledAt: string;
  dispute?: {
    reason: string;
    description: string;
    openedAt: string;
    status: 'OPEN' | 'RESOLVED';
  };
}

export const locationSchema = z.object({
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const createBookingSchema = z.object({
  serviceListingId: z.string(),
  providerId: z.string().optional(),
  scheduledDate: z.string(),
  description: z.string().optional(),
  location: locationSchema.optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().optional(),
});

export const acceptJobSchema = z.object({
  assignmentId: z.string(),
  quotedPrice: z.number().optional(),
});

export const rejectJobSchema = z.object({
  rejectionReason: z.string().optional(),
});

export const updateJobStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED']),
});

export const createJobSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  categoryId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  budget: z.number().optional(),
  scheduledDate: z.string().optional(),
});

export type CreateBookingPayload = z.infer<typeof createBookingSchema>;
export type CancelBookingPayload = z.infer<typeof cancelBookingSchema>;
export type AcceptJobPayload = z.infer<typeof acceptJobSchema>;
export type RejectJobPayload = z.infer<typeof rejectJobSchema>;
export type UpdateJobStatusPayload = z.infer<typeof updateJobStatusSchema>;
export type CreateJobPayload = z.infer<typeof createJobSchema>;

export const bookingApi = {
  getBookingDetails: async (id: string) => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (data: CreateBookingPayload) => {
    createBookingSchema.parse(data);
    const response = await api.post<ApiResponse<{ id: string; status: string; createdAt: string }>>('/bookings', data);
    return response.data;
  },

  cancelBooking: async (id: string, reason?: string) => {
    const payload = cancelBookingSchema.parse({ reason });
    const response = await api.post<ApiResponse<{ id: string; status: string; updatedAt: string }>>(`/bookings/${id}/cancel`, payload);
    return response.data;
  },

  resolveDispute: async (id: string, action: 'REFUND' | 'RELEASE', notes: string) => {
    const response = await api.post<ApiResponse<any>>(`/bookings/${id}/resolve-dispute`, {
      action,
      notes,
    });
    return response.data;
  },

  getBookingTimeline: async (id: string) => {
    const response = await api.get<ApiResponse<any[]>>(`/bookings/${id}/timeline`);
    return response.data;
  },

  getMyJobs: async (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await api.get<ApiResponse<any[]>>(`/jobs/my-jobs${query}`);
    return response.data;
  },

  getJobById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/jobs/${id}`);
    return response.data;
  },

  getAssignedJobs: async (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await api.get<ApiResponse<any[]>>(`/jobs/assigned${query}`);
    return response.data;
  },

  getAvailableJobs: async (lat: number, lng: number, radius?: number) => {
    const query = `?latitude=${lat}&longitude=${lng}${radius ? `&radiusKm=${radius}` : ''}`;
    const response = await api.get<ApiResponse<any[]>>(`/jobs/available${query}`);
    return response.data;
  },

  acceptJob: async (assignmentId: string, quotedPrice?: number) => {
    const payload = acceptJobSchema.parse({ assignmentId, quotedPrice });
    const response = await api.post<ApiResponse<any>>('/jobs/assignments/accept', payload);
    return response.data;
  },

  rejectJob: async (assignmentId: string, rejectionReason?: string) => {
    const payload = rejectJobSchema.parse({ rejectionReason });
    const response = await api.post<ApiResponse<any>>(`/jobs/assignments/${assignmentId}/reject`, payload);
    return response.data;
  },

  createJob: async (data: CreateJobPayload) => {
    createJobSchema.parse(data);
    const response = await api.post<ApiResponse<any>>('/jobs', data);
    return response.data;
  },

  updateJobStatus: async (id: string, status: 'ACCEPTED' | 'ON_THE_WAY' | 'IN_PROGRESS' | 'COMPLETED') => {
    const payload = updateJobStatusSchema.parse({ status });
    const response = await api.post<ApiResponse<any>>(`/jobs/${id}/status`, payload);
    return response.data;
  },

  getTrackingSession: async (bookingId: string) => {
    const response = await api.get<ApiResponse<TrackingSession>>(`/tracking/${bookingId}`);
    return response.data;
  },

  getTrackingEvents: async (bookingId: string, since?: string) => {
    const response = await api.get<ApiResponse<TrackingEvent[]>>(`/tracking/${bookingId}/events`, { params: { since } });
    return response.data;
  },
};

export interface TrackingSession {
  id: string;
  bookingId: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'NOT_STARTED';
  providerLatitude?: number | null;
  providerLongitude?: number | null;
  eta?: string | null;
  lastUpdated?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
}

export interface TrackingEvent {
  id: string;
  type: 'STATUS_CHANGE' | 'LOCATION_UPDATE' | 'MILESTONE' | 'ETA_UPDATE';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    latitude?: number;
    longitude?: number;
    eta?: string;
  };
}
