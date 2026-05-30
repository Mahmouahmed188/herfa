import { queryClient, STALE_TIMES } from './react-query';

export function prefetchQuery(queryKey: string[], fetchFn: () => Promise<unknown>, staleTime?: number) {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime: staleTime ?? STALE_TIMES.details,
  });
}

export function ensureQueryData<T>(queryKey: string[], fetchFn: () => Promise<T>) {
  return queryClient.ensureQueryData({
    queryKey,
    queryFn: fetchFn,
    staleTime: STALE_TIMES.details,
  });
}
