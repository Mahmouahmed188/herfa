import { z } from 'zod';

export const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  category: z.enum(['TECHNICAL', 'BILLING', 'ACCOUNT', 'GENERAL', 'DISPUTE']),
  assignedTo: z.string().optional(),
});

export const ticketStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED']),
  note: z.string().optional(),
});

export type SupportTicketInput = z.infer<typeof supportTicketSchema>;
export type TicketStatusInput = z.infer<typeof ticketStatusSchema>;
