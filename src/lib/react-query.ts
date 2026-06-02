import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const STALE_TIMES = {
  dashboard: 1000 * 60 * 2,
  lists: 1000 * 60 * 5,
  details: 1000 * 60 * 10,
  settings: 1000 * 60 * 30,
  analytics: 1000 * 60 * 15,
} as const;

export const GC_TIMES = {
  default: 1000 * 60 * 30,
  analytics: 1000 * 60 * 60,
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIMES.lists,
      gcTime: GC_TIMES.default,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.error?.code && error.error.code.startsWith('4')) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      onError: (error: any) => {
        const message = error?.error?.message || 'An error occurred';
        toast.error(message);
      },
    },
  },
});
