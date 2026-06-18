import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addressApi } from '../services/api';
import { Address } from '../types';

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses', 'list'],
    queryFn: () => addressApi.getAll(),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addressApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', 'list'] });
      toast.success('Address created successfully');
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
      addressApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', 'list'] });
      toast.success('Address updated successfully');
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addressApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', 'list'] });
      toast.success('Address deleted successfully');
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addressApi.setDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', 'list'] });
      toast.success('Default address updated');
    },
  });
}
