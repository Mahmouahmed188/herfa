import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/api';
import { toast } from 'sonner';

export function useUsers(params?: {
  page?: number;
  limit?: number;
  query?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => usersApi.getUsers(params),
  });
}

export function useUserDetails(id: string) {
  return useQuery({
    queryKey: ['users', 'details', id],
    queryFn: () => usersApi.getUserDetails(id),
    enabled: !!id,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; status: 'ACTIVE' | 'SUSPENDED'; reason: string }) =>
      usersApi.updateUserStatus(data.id, data.status, data.reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`User status updated to ${variables.status.toLowerCase()}`);
    },
  });
}

export function useUserActivity(id: string) {
  return useQuery({
    queryKey: ['users', 'activity', id],
    queryFn: () => usersApi.getUserActivity(id),
    enabled: !!id,
  });
}
