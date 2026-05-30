import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsApi, Category } from '../services/api';
import { toast } from 'sonner';

export function useCategories(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['cms', 'categories', params],
    queryFn: () => cmsApi.getCategories(params),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cmsApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'categories'] });
      toast.success('Category created successfully');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      cmsApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms', 'categories'] });
      toast.success('Category updated');
    },
  });
}
