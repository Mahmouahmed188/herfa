import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../services/api';

export function useAuditLogs(params?: {
  page?: number;
  limit?: number;
  query?: string;
  module?: string;
}) {
  return useQuery({
    queryKey: ['audit', 'logs', params],
    queryFn: () => auditApi.getAuditLogs(params),
  });
}
