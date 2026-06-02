import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi, PlatformSettings } from '../services/api';
import { toast } from 'sonner';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getSettings(),
  });
}

export function useUpdateCommission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlatformSettings['commission']) => settingsApi.updateCommission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Commission settings updated');
    },
  });
}

export function useUpdateLocalization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlatformSettings['localization']) => settingsApi.updateLocalization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Localization settings updated');
    },
  });
}

export function useUpdateSecurity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlatformSettings['security']) => settingsApi.updateSecurity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Security settings updated');
    },
  });
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: ['settings', 'feature-flags'],
    queryFn: () => settingsApi.getFeatureFlags(),
  });
}

export function useToggleFeatureFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; enabled: boolean }) => settingsApi.toggleFeatureFlag(data.id, data.enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'feature-flags'] });
      toast.success('Feature flag updated');
    },
  });
}
