import { api } from '@/lib/axios';

export interface ReportQuery {
  type: 'revenue' | 'users' | 'providers' | 'bookings' | 'support';
  format?: 'csv' | 'pdf' | 'excel';
  period?: '7d' | '30d' | '90d' | '1y' | 'custom';
  startDate?: string;
  endDate?: string;
}

export const reportService = {
  exportReport: async (query: ReportQuery) => {
    const params = {
      type: query.type,
      format: query.format || 'csv',
      period: query.period || '30d',
      ...(query.startDate && { startDate: query.startDate }),
      ...(query.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/admin/reports/export', { params });
    return response.data;
  },

  getRevenueReport: async (period = '30d', startDate?: string, endDate?: string) => {
    const params = { period, ...(startDate && { startDate }), ...(endDate && { endDate }) };
    const response = await api.get('/admin/reports/revenue', { params });
    return response.data;
  },

  getFinancialReport: async (period = '30d') => {
    const params = { period };
    const response = await api.get('/admin/reports/financial', { params });
    return response.data;
  },

  downloadReport: async (downloadUrl: string, filename: string) => {
    const response = await api.get(downloadUrl, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
