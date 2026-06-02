import { z } from 'zod';

export const commissionSchema = z.object({
  serviceCommission: z.coerce.number().min(0).max(100),
  providerCommission: z.coerce.number().min(0).max(100),
  minimumPayout: z.coerce.number().min(0),
  commissionType: z.enum(['PERCENTAGE', 'FIXED']),
});

export const localizationSchema = z.object({
  defaultLocale: z.enum(['en', 'ar']),
  supportedLocales: z.array(z.enum(['en', 'ar'])),
  timezone: z.string(),
  currency: z.string().length(3),
  dateFormat: z.string(),
});

export const securitySchema = z.object({
  maxLoginAttempts: z.coerce.number().min(1).max(10),
  sessionTimeout: z.coerce.number().min(5).max(1440),
  mfaRequired: z.boolean(),
  passwordMinLength: z.coerce.number().min(6).max(128),
  auditRetentionDays: z.coerce.number().min(30).max(365),
});

export type CommissionInput = z.infer<typeof commissionSchema>;
export type LocalizationInput = z.infer<typeof localizationSchema>;
export type SecurityInput = z.infer<typeof securitySchema>;
