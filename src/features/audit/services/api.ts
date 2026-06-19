import { api } from '@/lib/axios';

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  actorType?: 'user' | 'provider' | 'admin' | 'system';
  action?: string;
  startDate?: string;
  endDate?: string;
}

export const auditApi = {
  getAuditLogs: async (query: AuditLogQuery = {}) => {
    const params = {
      page: query.page || 1,
      limit: query.limit || 20,
      ...(query.actorType && { actorType: query.actorType }),
      ...(query.action && { action: query.action }),
      ...(query.startDate && { startDate: query.startDate }),
      ...(query.endDate && { endDate: query.endDate }),
    };

    const response = await api.get('/admin/audit/logs', { params });
    return response.data;
  },

  getAuditLogDetail: async (logId: string) => {
    const response = await api.get(`/admin/audit/logs/${logId}`);
    return response.data;
  },

  logAction: async (data: {
    action: string;
    actorType: 'admin';
    targetType?: string;
    targetId?: string;
    details?: Record<string, unknown>;
  }) => {
    const response = await api.post('/admin/audit/logs', data);
    return response.data;
  },

  exportAuditLogs: async (format: 'csv' | 'json', query?: AuditLogQuery) => {
    const params = { format, ...query };
    const response = await api.get('/admin/audit/export', { params });
    return response.data;
  },
};
