'use client';

import * as React from 'react';
import { useSettings, useUpdateLocalization } from '../hooks/useSettings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { localizationSchema, LocalizationInput } from '../schemas/settings';
import { Loading } from '@/components/common/Loading';
import { FormField } from '@/components/ui/forms/FormField';

export function LocalizationForm() {
  const { data, isLoading } = useSettings();
  const updateMutation = useUpdateLocalization();

  const methods = useForm<LocalizationInput>({
    resolver: zodResolver(localizationSchema),
    values: data?.data?.localization ? {
      defaultLocale: data.data.localization.defaultLocale,
      supportedLocales: data.data.localization.supportedLocales,
      timezone: data.data.localization.timezone,
      currency: data.data.localization.currency,
      dateFormat: data.data.localization.dateFormat,
    } : undefined,
  });

  if (isLoading) return <Loading fullPage />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localization Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit((v) => updateMutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="defaultLocale" label="Default Language">
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...methods.register('defaultLocale')}>
                  <option value="ar">Arabic</option>
                  <option value="en">English</option>
                </select>
              </FormField>
              <FormField name="currency" label="Currency Code">
                <Input placeholder="SAR" maxLength={3} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="timezone" label="Timezone">
                <Input placeholder="Asia/Riyadh" />
              </FormField>
              <FormField name="dateFormat" label="Date Format">
                <Input placeholder="PPP" />
              </FormField>
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>Save Localization Settings</Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
