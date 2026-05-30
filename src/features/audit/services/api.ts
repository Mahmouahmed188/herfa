import { api } from '@/lib/axios';
import { PaginatedResponse, BaseEntity } from '@/types/api';

export interface AuditLog extends BaseEntity {
  adminId: string;
  adminName: string;
  action: string;
  module: string;
  entityId?: string;
  details: string;
  ipAddress: string;
}

export const auditApi = {
  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
    module?: string;
  }) => {
    const response = await api.get<PaginatedResponse<AuditLog>>('/audit/logs', { params });
    return response.data;
  },
};
