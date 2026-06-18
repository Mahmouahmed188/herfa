import { BaseEntity, PaginatedResponse } from '@/types/api';

export type PaymentStatus = 
  | 'PENDING' 
  | 'AUTHORIZED' 
  | 'PAID' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED' 
  | 'FAILED' 
  | 'CANCELLED';

export interface Payment extends BaseEntity {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionRef: string;
  createdAt: string;
  updatedAt: string;
}

export type RefundStatus = 
  | 'REQUESTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PROCESSED' 
  | 'COMPLETED';

export interface Refund extends BaseEntity {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalEarnings: number;
  pendingEarnings: number;
  totalRefunds: number;
  transactionCount: number;
}

export type PaymentListResponse = PaginatedResponse<Payment>;
export type RefundListResponse = PaginatedResponse<Refund>;
