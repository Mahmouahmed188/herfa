import { z } from 'zod';

// Attachment Schema
export const AttachmentSchema = z.object({
  id: z.string(),
  filename: z.string(),
  url: z.string(),
  size: z.number(),
  mimeType: z.string(),
  uploadedAt: z.string(),
});

// Support Message Schema
export const SupportMessageSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  adminId: z.string().nullable(),
  content: z.string(),
  type: z.enum(['user', 'admin', 'system']),
  attachments: z.array(AttachmentSchema),
  createdAt: z.string(),
});

// Basic Support Ticket Schema
export const SupportTicketSchema = z.object({
  id: z.string(),
  userId: z.string(),
  providerId: z.string().nullable(),
  bookingId: z.string().nullable(),
  subject: z.string(),
  category: z.enum(['technical', 'billing', 'booking', 'account', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  assigneeId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().nullable(),
});

// Complete Support Ticket Schema
export const SupportTicketDetailSchema = z.object({
  id: z.string(),
  userId: z.string(),
  providerId: z.string().nullable(),
  bookingId: z.string().nullable(),
  subject: z.string(),
  category: z.enum(['technical', 'billing', 'booking', 'account', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  assigneeId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().nullable(),
  conversation: z.array(SupportMessageSchema),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  provider: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }).nullable(),
  booking: z.object({
    id: z.string(),
    service: z.string(),
    scheduledDate: z.string(),
    scheduledTime: z.string(),
  }).nullable(),
});

// Support Ticket Query Schema
export const SupportTicketQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['technical', 'billing', 'booking', 'account', 'other']).optional(),
  assignee: z.string().optional(),
});

// Support Ticket List Response Schema
export const SupportTicketListResponseSchema = z.object({
  tickets: z.array(SupportTicketSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// Ticket Assignment Schema
export const TicketAssignmentSchema = z.object({
  assigneeId: z.string(),
});

// Ticket Reply Schema
export const TicketReplySchema = z.object({
  content: z.string(),
  attachments: z.array(z.object({
    filename: z.string(),
    url: z.string(),
    size: z.number(),
    mimeType: z.string(),
  })).optional(),
});

// Ticket Status Update Schema
export const TicketStatusUpdateSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  notes: z.string().optional(),
});

// Dispute Schema
export const DisputeSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  userId: z.string(),
  providerId: z.string(),
  reason: z.enum(['service_quality', 'payment_issue', 'no_show', 'other']),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().nullable(),
});

// Dispute Evidence Schema
export const DisputeEvidenceSchema = z.object({
  id: z.string(),
  type: z.enum(['photo', 'document', 'message', 'other']),
  url: z.string(),
  description: z.string(),
  uploadedAt: z.string(),
});

// Dispute History Schema
export const DisputeHistorySchema = z.object({
  id: z.string(),
  action: z.enum(['filed', 'reviewed', 'resolved', 'closed']),
  adminId: z.string().nullable(),
  notes: z.string().nullable(),
  timestamp: z.string(),
});

// Complete Dispute Schema
export const DisputeDetailSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  userId: z.string(),
  providerId: z.string(),
  reason: z.enum(['service_quality', 'payment_issue', 'no_show', 'other']),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().nullable(),
  participants: z.object({
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
    provider: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
  }),
  evidence: z.array(DisputeEvidenceSchema),
  history: z.array(DisputeHistorySchema),
});

// Dispute Query Schema
export const DisputeQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  reason: z.enum(['service_quality', 'payment_issue', 'no_show', 'other']).optional(),
});

// Dispute List Response Schema
export const DisputeListResponseSchema = z.object({
  disputes: z.array(DisputeSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// Dispute Resolution Schema
export const DisputeResolutionSchema = z.object({
  resolution: z.string(),
  notes: z.string().optional(),
});

// Export all schemas
export const SupportSchemas = {
  base: SupportTicketSchema,
  detail: SupportTicketDetailSchema,
  message: SupportMessageSchema,
  attachment: AttachmentSchema,
  listQuery: SupportTicketQuerySchema,
  listResponse: SupportTicketListResponseSchema,
  assignment: TicketAssignmentSchema,
  reply: TicketReplySchema,
  statusUpdate: TicketStatusUpdateSchema,
  dispute: DisputeSchema,
  disputeDetail: DisputeDetailSchema,
  disputeEvidence: DisputeEvidenceSchema,
  disputeHistory: DisputeHistorySchema,
  disputeQuery: DisputeQuerySchema,
  disputeListResponse: DisputeListResponseSchema,
  resolution: DisputeResolutionSchema,
};