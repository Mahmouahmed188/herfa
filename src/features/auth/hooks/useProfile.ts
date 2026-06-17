import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, updateProfile, uploadFile } from '@/services/api';

export function useProfile() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => getCurrentUser(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      avatarUrl?: string;
    }) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: (file: File) => uploadFile(file),
  });
}
