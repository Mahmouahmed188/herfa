'use client';

import * as React from 'react';
import { useSettings, useUpdateSecurity } from '../hooks/useSettings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { securitySchema, SecurityInput } from '../schemas/settings';
import { Loading } from '@/components/common/Loading';
import { FormField } from '@/components/ui/forms/FormField';

export function SecurityForm() {
  const { data, isLoading } = useSettings();
  const updateMutation = useUpdateSecurity();

  const methods = useForm<SecurityInput>({
    resolver: zodResolver(securitySchema),
    values: data?.data?.security ? {
      maxLoginAttempts: data.data.security.maxLoginAttempts,
      sessionTimeout: data.data.security.sessionTimeout,
      mfaRequired: data.data.security.mfaRequired,
      passwordMinLength: data.data.security.passwordMinLength,
      auditRetentionDays: data.data.security.auditRetentionDays,
    } : undefined,
  });

  if (isLoading) return <Loading fullPage />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit((v) => updateMutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="maxLoginAttempts" label="Max Login Attempts">
                <Input type="number" min={1} max={10} />
              </FormField>
              <FormField name="sessionTimeout" label="Session Timeout (minutes)">
                <Input type="number" min={5} max={1440} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="passwordMinLength" label="Min Password Length">
                <Input type="number" min={6} max={128} />
              </FormField>
              <FormField name="auditRetentionDays" label="Audit Retention (days)">
                <Input type="number" min={30} max={365} />
              </FormField>
            </div>
            <FormField name="mfaRequired" label="Require MFA">
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...methods.register('mfaRequired')}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
            <Button type="submit" disabled={updateMutation.isPending}>Save Security Settings</Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
