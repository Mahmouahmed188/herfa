import { z } from 'zod';

// Payment Method Schema
export const PaymentMethodSchema = z.object({
  method: z.enum(['credit_card', 'bank_transfer', 'wallet', 'other']),
});

// Basic Payment Schema
export const PaymentSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  userId: z.string(),
  providerId: z.string(),
  amount: z.number().min(0),
  currency: z.string(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  method: z.enum(['credit_card', 'bank_transfer', 'wallet', 'other']),
  transactionId: z.string().nullable(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
  refundedAt: z.string().nullable(),
});

// Payment Timeline Schema
export const PaymentTimelineSchema = z.object({
  event: z.string(),
  timestamp: z.string(),
  details: z.string(),
});

// Complete Payment Detail Schema
export const PaymentDetailSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  userId: z.string(),
  providerId: z.string(),
  amount: z.number().min(0),
  currency: z.string(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  method: z.enum(['credit_card', 'bank_transfer', 'wallet', 'other']),
  transactionId: z.string().nullable(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
  refundedAt: z.string().nullable(),
  paymentTimeline: z.array(PaymentTimelineSchema),
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
  booking: z.object({
    id: z.string(),
    service: z.string(),
    scheduledDate: z.string(),
    scheduledTime: z.string(),
  }),
});

// Payment Query Schema
export const PaymentQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
  method: z.enum(['credit_card', 'bank_transfer', 'wallet', 'other']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Payment List Response Schema
export const PaymentListResponseSchema = z.object({
  payments: z.array(PaymentSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// Payment Overview Schema
export const PaymentOverviewSchema = z.object({
  totalPayments: z.number(),
  pendingPayments: z.number(),
  completedPayments: z.number(),
  failedPayments: z.number(),
  totalAmount: z.number(),
  pendingAmount: z.number(),
  todayPayments: z.number(),
  todayAmount: z.number(),
  paymentMethods: z.array(z.object({
    method: z.enum(['credit_card', 'bank_transfer', 'wallet', 'other']),
    count: z.number(),
    percentage: z.number(),
  })),
  paymentTrend: z.array(z.object({
    date: z.string(),
    count: z.number(),
    amount: z.number(),
  })),
});

// Refund Schema
export const RefundSchema = z.object({
  id: z.string(),
  paymentId: z.string(),
  bookingId: z.string(),
  userId: z.string(),
  providerId: z.string(),
  amount: z.number().min(0),
  currency: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'processed']),
  reason: z.string(),
  requestedBy: z.string(),
  approvedBy: z.string().nullable(),
  processedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Refund Query Schema
export const RefundQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(['pending', 'approved', 'rejected', 'processed']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Refund List Response Schema
export const RefundListResponseSchema = z.object({
  refunds: z.array(RefundSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// Complete Refund Detail Schema
export const RefundDetailSchema = z.object({
  id: z.string(),
  paymentId: z.string(),
  bookingId: z.string(),
  userId: z.string(),
  providerId: z.string(),
  amount: z.number().min(0),
  currency: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'processed']),
  reason: z.string(),
  requestedBy: z.string(),
  approvedBy: z.string().nullable(),
  processedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  relatedPayment: z.object({
    id: z.string(),
    amount: z.number(),
    status: z.string(),
    createdAt: z.string(),
  }),
  statusHistory: z.array(z.object({
    status: z.string(),
    changedBy: z.string().nullable(),
    changedAt: z.string(),
    notes: z.string().nullable(),
  })),
});

// Refund Approval Schema
export const RefundApprovalSchema = z.object({
  notes: z.string().optional(),
});

// Refund Rejection Schema
export const RefundRejectionSchema = z.object({
  reason: z.string(),
  notes: z.string().optional(),
});

// Financial Report Schema
export const FinancialReportSchema = z.object({
  period: z.string(),
  totalRevenue: z.number(),
  averageDailyRevenue: z.number(),
  revenueByService: z.array(z.object({
    service: z.string(),
    revenue: z.number(),
    percentage: z.number(),
  })),
  revenueByProvider: z.array(z.object({
    provider: z.string(),
    revenue: z.number(),
    percentage: z.number(),
  })),
  revenueTrend: z.array(z.object({
    date: z.string(),
    revenue: z.number(),
  })),
  generatedAt: z.string(),
});

// Export all schemas
export const FinanceSchemas = {
  base: PaymentSchema,
  detail: PaymentDetailSchema,
  timeline: PaymentTimelineSchema,
  query: PaymentQuerySchema,
  listResponse: PaymentListResponseSchema,
  overview: PaymentOverviewSchema,
  refund: RefundSchema,
  refundQuery: RefundQuerySchema,
  refundListResponse: RefundListResponseSchema,
  refundDetail: RefundDetailSchema,
  refundApproval: RefundApprovalSchema,
  refundRejection: RefundRejectionSchema,
  report: FinancialReportSchema,
};