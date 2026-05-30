import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface PlatformSettings {
  commission: {
    serviceCommission: number;
    providerCommission: number;
    minimumPayout: number;
    commissionType: 'PERCENTAGE' | 'FIXED';
  };
  localization: {
    defaultLocale: 'en' | 'ar';
    supportedLocales: ('en' | 'ar')[];
    timezone: string;
    currency: string;
    dateFormat: string;
  };
  security: {
    maxLoginAttempts: number;
    sessionTimeout: number;
    mfaRequired: boolean;
    passwordMinLength: number;
    auditRetentionDays: number;
  };
  featureFlags: FeatureFlag[];
}

export interface FeatureFlag {
  id: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  enabledForRoles: string[];
}

export const settingsApi = {
  getSettings: async () => {
    const response = await api.get<ApiResponse<PlatformSettings>>('/settings');
    return response.data;
  },

  updateCommission: async (data: PlatformSettings['commission']) => {
    const response = await api.put<ApiResponse<PlatformSettings>>('/settings/commission', data);
    return response.data;
  },

  updateLocalization: async (data: PlatformSettings['localization']) => {
    const response = await api.put<ApiResponse<PlatformSettings>>('/settings/localization', data);
    return response.data;
  },

  updateSecurity: async (data: PlatformSettings['security']) => {
    const response = await api.put<ApiResponse<PlatformSettings>>('/settings/security', data);
    return response.data;
  },

  getFeatureFlags: async () => {
    const response = await api.get<ApiResponse<FeatureFlag[]>>('/settings/feature-flags');
    return response.data;
  },

  toggleFeatureFlag: async (id: string, enabled: boolean) => {
    const response = await api.patch<ApiResponse<FeatureFlag>>(`/settings/feature-flags/${id}`, { enabled });
    return response.data;
  },
};
