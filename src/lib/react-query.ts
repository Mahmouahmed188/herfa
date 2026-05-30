import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
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
