import { useQuery, useMutation } from '@tanstack/react-query';
import { auditApi, type AuditLogQuery } from '../services/api';

export const useAuditLogs = (query: AuditLogQuery = {}) => {
  return useQuery({
    queryKey: ['audit-logs', query.page, query.limit, query.actorType, query.action],
    queryFn: () => auditApi.getAuditLogs(query),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAuditLogDetail = (logId: string) => {
  return useQuery({
    queryKey: ['audit-logs', logId, 'detail'],
    queryFn: () => auditApi.getAuditLogDetail(logId),
    select: (response) => response.data,
    enabled: !!logId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useLogAction = () => {
  return useMutation({
    mutationFn: (data: {
      action: string;
      actorType: 'admin';
      targetType?: string;
      targetId?: string;
      details?: Record<string, unknown>;
    }) => auditApi.logAction(data),
  });
};

export const useExportAuditLogs = () => {
  return useMutation({
    mutationFn: ({ format, query }: { format: 'csv' | 'json'; query?: AuditLogQuery }) =>
      auditApi.exportAuditLogs(format, query),
  });
};
