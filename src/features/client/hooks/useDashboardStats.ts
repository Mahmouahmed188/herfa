import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';

export interface DashboardStats {
  activeOrders: number;
  pendingCount: number;
  completedCount: number;
  totalOrders: number;
}

interface JobLike {
  status: string;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['clientJobs', 'stats'],
    queryFn: async () => {
      try {
        const response = await api.getMyJobs();
        const jobs = (Array.isArray(response) ? response : []) as JobLike[];
        const stats: DashboardStats = {
          activeOrders: jobs.filter(
            (j) => j.status !== 'COMPLETED' && j.status !== 'CANCELLED'
          ).length,
          pendingCount: jobs.filter((j) => j.status === 'PENDING').length,
          completedCount: jobs.filter((j) => j.status === 'COMPLETED').length,
          totalOrders: jobs.length,
        };
        return stats;
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        // Return default stats instead of throwing
        return {
          activeOrders: 0,
          pendingCount: 0,
          completedCount: 0,
          totalOrders: 0,
        };
      }
    },
  });
}
