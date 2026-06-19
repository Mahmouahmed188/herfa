import { api } from '@/lib/axios';
import { FinanceSchemas } from '../schemas';
import type { 
  Payment,
  PaymentDetail,
  PaymentQuery,
  PaymentListResponse,
  PaymentOverview,
  Refund,
  RefundQuery,
  RefundListResponse,
  RefundDetail,
  RefundApproval,
  RefundRejection,
  FinancialReport
} from '../types';

export const financeApi = {
  // Payment Management
  /**
   * Get payments dashboard overview
   */
  getPaymentsOverview: async () => {
    const response = await api.get('/admin/payments/overview');
    return FinanceSchemas.overview.parse(response.data);
  },

  /**
   * Get paginated list of payments
   */
  getPayments: async (query: PaymentQuery) => {
    const params = {
      page: query.page,
      limit: query.limit,
      ...(query.status && { status: query.status }),
      ...(query.method && { method: query.method }),
      ...(query.startDate && { startDate: query.startDate }),
      ...(query.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/admin/payments', { params });
    return FinanceSchemas.listResponse.parse(response.data);
  },

  /**
   * Get detailed payment information
   */
  getPaymentDetail: async (paymentId: string) => {
    const response = await api.get(`/admin/payments/${paymentId}`);
    return FinanceSchemas.detail.parse(response.data);
  },

  /**
   * Get payment statistics
   */
  getPaymentStats: async () => {
    const response = await api.get('/admin/payments/stats');
    return response.data;
  },

  /**
   * Get payment by method
   */
  getPaymentsByMethod: async (method: string) => {
    const response = await api.get(`/admin/payments/method/${method}`);
    return response.data;
  },

  /**
   * Get payment trends
   */
  getPaymentTrends: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/payments/trends', { params });
    return response.data;
  },

  /**
   * Search payments
   */
  searchPayments: async (query: {
    search?: string;
    status?: string;
    method?: string;
    dateRange?: string;
    amount?: number;
  }) => {
    const response = await api.get('/admin/payments/search', { params: query });
    return response.data;
  },

  /**
   * Export payments
   */
  exportPayments: async (format: 'csv' | 'excel' | 'json', filters?: any) => {
    const params = { format, ...filters };
    const response = await api.get('/admin/payments/export', { params });
    return response.data;
  },

  // Refund Management
  /**
   * Get paginated list of refund requests
   */
  getRefunds: async (query: RefundQuery) => {
    const params = {
      page: query.page,
      limit: query.limit,
      ...(query.status && { status: query.status }),
      ...(query.startDate && { startDate: query.startDate }),
      ...(query.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/admin/refunds', { params });
    return FinanceSchemas.refundListResponse.parse(response.data);
  },

  /**
   * Get detailed refund information
   */
  getRefundDetail: async (refundId: string) => {
    const response = await api.get(`/admin/refunds/${refundId}`);
    return FinanceSchemas.refundDetail.parse(response.data);
  },

  /**
   * Approve a refund request
   */
  approveRefund: async (refundId: string, data: RefundApproval) => {
    const response = await api.post(`/admin/refunds/${refundId}/approve`, data);
    return response.data;
  },

  /**
   * Reject a refund request
   */
  rejectRefund: async (refundId: string, data: RefundRejection) => {
    const response = await api.post(`/admin/refunds/${refundId}/reject`, data);
    return response.data;
  },

  /**
   * Get refund statistics
   */
  getRefundStats: async () => {
    const response = await api.get('/admin/refunds/stats');
    return response.data;
  },

  /**
   * Get refund by reason
   */
  getRefundsByReason: async (reason: string) => {
    const response = await api.get(`/admin/refunds/reason/${reason}`);
    return response.data;
  },

  /**
   * Search refunds
   */
  searchRefunds: async (query: {
    search?: string;
    status?: string;
    reason?: string;
    dateRange?: string;
    amount?: number;
  }) => {
    const response = await api.get('/admin/refunds/search', { params: query });
    return response.data;
  },

  /**
   * Export refunds
   */
  exportRefunds: async (format: 'csv' | 'excel' | 'json', filters?: any) => {
    const params = { format, ...filters };
    const response = await api.get('/admin/refunds/export', { params });
    return response.data;
  },

  // Financial Reports
  /**
   * Generate revenue report
   */
  generateRevenueReport: async (period = '30d', startDate?: string, endDate?: string) => {
    const params = { period, ...(startDate && { startDate }), ...(endDate && { endDate }) };
    const response = await api.get('/admin/reports/revenue', { params });
    return FinanceSchemas.report.parse(response.data);
  },

  /**
   * Generate financial report
   */
  generateFinancialReport: async (type: 'revenue' | 'users' | 'providers' | 'bookings' | 'support', period = '30d') => {
    const params = { type, period };
    const response = await api.get('/admin/reports/financial', { params });
    return response.data;
  },

  /**
   * Get report templates
   */
  getReportTemplates: async () => {
    const response = await api.get('/admin/reports/templates');
    return response.data;
  },

  /**
   * Create custom report
   */
  createCustomReport: async (data: {
    name: string;
    type: string;
    metrics: string[];
    filters: any;
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      time: string;
    };
  }) => {
    const response = await api.post('/admin/reports/custom', data);
    return response.data;
  },

  // Financial Dashboard
  // Provider-specific Endpoints
  /**
   * Get provider earnings summary
   */
  getProviderEarnings: async (providerId?: string) => {
    const url = providerId ? `/admin/providers/${providerId}/earnings` : '/providers/me/earnings';
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Get provider payments
   */
  getProviderPayments: async (query: { page?: number; limit?: number; status?: string; providerId?: string }) => {
    const { providerId, ...rest } = query;
    const params = {
      page: rest.page ?? 1,
      limit: rest.limit ?? 20,
      ...(rest.status && { status: rest.status }),
    };
    const url = providerId ? `/admin/providers/${providerId}/payments` : '/providers/me/payments';
    const response = await api.get(url, { params });
    return response.data;
  },

  /**
   * Get financial dashboard data
   */
  getFinancialDashboard: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/finance/dashboard', { params });
    return response.data;
  },

  /**
   * Get revenue by service
   */
  getRevenueByService: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/finance/revenue-by-service', { params });
    return response.data;
  },

  /**
   * Get revenue by provider
   */
  getRevenueByProvider: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/finance/revenue-by-provider', { params });
    return response.data;
  },

  /**
   * Get transaction history
   */
  getTransactionHistory: async (page = 1, limit = 20, filters?: any) => {
    const params = { page, limit, ...filters };
    const response = await api.get('/admin/finance/transactions', { params });
    return response.data;
  },

  // Analytics
  /**
   * Get financial analytics
   */
  getFinancialAnalytics: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/finance/analytics', { params });
    return response.data;
  },

  /**
   * Get cash flow analysis
   */
  getCashFlowAnalysis: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/finance/cash-flow', { params });
    return response.data;
  },

  /**
   * Get profit margins
   */
  getProfitMargins: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/finance/profit-margins', { params });
    return response.data;
  },
};