// Finance Management Types

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'credit_card' | 'bank_transfer' | 'wallet' | 'other';
  transactionId: string | null;
  createdAt: string;
  completedAt: string | null;
  refundedAt: string | null;
}

export interface PaymentTimeline {
  event: string;
  timestamp: string;
  details: string;
}

export interface PaymentDetail {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'credit_card' | 'bank_transfer' | 'wallet' | 'other';
  transactionId: string | null;
  createdAt: string;
  completedAt: string | null;
  refundedAt: string | null;
  paymentTimeline: PaymentTimeline[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  provider: {
    id: string;
    name: string;
    email: string;
  };
  booking: {
    id: string;
    service: string;
    scheduledDate: string;
    scheduledTime: string;
  };
}

export interface PaymentQuery {
  page: number;
  limit: number;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  method?: 'credit_card' | 'bank_transfer' | 'wallet' | 'other';
  startDate?: string;
  endDate?: string;
}

export interface PaymentListResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaymentOverview {
  totalPayments: number;
  pendingPayments: number;
  completedPayments: number;
  failedPayments: number;
  totalAmount: number;
  pendingAmount: number;
  todayPayments: number;
  todayAmount: number;
  paymentMethods: PaymentMethodStats[];
  paymentTrend: PaymentTrendItem[];
}

export interface PaymentMethodStats {
  method: 'credit_card' | 'bank_transfer' | 'wallet' | 'other';
  count: number;
  percentage: number;
}

export interface PaymentTrendItem {
  date: string;
  count: number;
  amount: number;
}

export interface Refund {
  id: string;
  paymentId: string;
  bookingId: string;
  userId: string;
  providerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  reason: string;
  requestedBy: string;
  approvedBy: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RefundQuery {
  page: number;
  limit: number;
  status?: 'pending' | 'approved' | 'rejected' | 'processed';
  startDate?: string;
  endDate?: string;
}

export interface RefundListResponse {
  refunds: Refund[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RefundDetail {
  id: string;
  paymentId: string;
  bookingId: string;
  userId: string;
  providerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  reason: string;
  requestedBy: string;
  approvedBy: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  relatedPayment: {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  };
  statusHistory: RefundStatusHistory[];
}

export interface RefundStatusHistory {
  status: string;
  changedBy: string | null;
  changedAt: string;
  notes: string | null;
}

export interface RefundApproval {
  notes?: string;
}

export interface RefundRejection {
  reason: string;
  notes?: string;
}

export interface FinancialReport {
  period: string;
  totalRevenue: number;
  averageDailyRevenue: number;
  revenueByService: RevenueByServiceItem[];
  revenueByProvider: RevenueByProviderItem[];
  revenueTrend: RevenueTrendItem[];
  generatedAt: string;
}

export interface RevenueByServiceItem {
  service: string;
  revenue: number;
  percentage: number;
}

export interface RevenueByProviderItem {
  provider: string;
  revenue: number;
  percentage: number;
}

export interface RevenueTrendItem {
  date: string;
  revenue: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Dashboard Types
export interface FinanceStats {
  totalRevenue: number;
  totalPayments: number;
  totalRefunds: number;
  averageTransactionValue: number;
  revenueGrowth: number;
  paymentSuccessRate: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  growth: number;
}

export interface TopRevenueService {
  service: string;
  revenue: number;
  percentage: number;
}

export interface TopRevenueProvider {
  provider: string;
  revenue: number;
  percentage: number;
}

export interface RecentTransaction {
  id: string;
  type: 'payment' | 'refund';
  amount: number;
  status: string;
  user: string;
  createdAt: string;
}

// Provider-specific Types
export interface FinancialSummary {
  totalEarnings: number;
  pendingEarnings: number;
  totalRefunds: number;
  transactionCount: number;
}

// Form Types
export interface PaymentFormData {
  bookingId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'bank_transfer' | 'wallet' | 'other';
  transactionId?: string;
}

export interface RefundFormData {
  paymentId: string;
  reason: string;
  amount?: number;
}

export interface ReportFormData {
  type: 'revenue' | 'users' | 'providers' | 'bookings' | 'support';
  format: 'csv' | 'pdf' | 'excel';
  period: '7d' | '30d' | '90d' | '1y' | 'custom';
  startDate?: string;
  endDate?: string;
}

// Error Types
export interface FinanceError {
  code: string;
  message: string;
  details?: string;
}

// Loading States
export interface FinanceLoadingState {
  isLoading: boolean;
  isProcessing: boolean;
  isRefunding: boolean;
  isGeneratingReport: boolean;
}

// Chart Types
export interface RevenueChartData {
  period: string;
  data: RevenueChartItem[];
  chartConfig: ChartConfig;
}

export interface RevenueChartItem {
  date: string;
  revenue: number;
  profit: number;
  bookings: number;
}

export interface ChartConfig {
  xAxis: {
    type: string;
    dataKey: string;
  };
  yAxis: {
    type: string;
  };
  series: ChartSeries[];
}

export interface ChartSeries {
  name: string;
  dataKey: string;
  color: string;
}