'use client';

import * as React from 'react';
import { useSettings, useUpdateCommission } from '../hooks/useSettings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commissionSchema, CommissionInput } from '../schemas/settings';
import { Loading } from '@/components/common/Loading';
import { FormField } from '@/components/ui/forms/FormField';

export function CommissionForm() {
  const { data, isLoading } = useSettings();
  const updateMutation = useUpdateCommission();

  const methods = useForm<CommissionInput>({
    resolver: zodResolver(commissionSchema),
    values: data?.data?.commission ? {
      serviceCommission: data.data.commission.serviceCommission,
      providerCommission: data.data.commission.providerCommission,
      minimumPayout: data.data.commission.minimumPayout,
      commissionType: data.data.commission.commissionType,
    } : undefined,
  });

  if (isLoading) return <Loading fullPage />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit((v) => updateMutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="serviceCommission" label="Service Commission (%)">
                <Input type="number" min={0} max={100} />
              </FormField>
              <FormField name="providerCommission" label="Provider Commission (%)">
                <Input type="number" min={0} max={100} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="minimumPayout" label="Minimum Payout (SAR)">
                <Input type="number" min={0} />
              </FormField>
              <FormField name="commissionType" label="Commission Type">
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...methods.register('commissionType')}>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                </select>
              </FormField>
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>Save Commission Settings</Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
