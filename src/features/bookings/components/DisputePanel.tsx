'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/forms/FormField';
import { Input } from '@/components/ui/input';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

const resolveDisputeSchema = z.object({
  action: z.enum(['REFUND', 'RELEASE']),
  notes: z.string().min(10, 'Please provide at least 10 characters of explanation'),
});

type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>;

interface DisputePanelProps {
  bookingId: string;
  onResolve: (data: ResolveDisputeInput) => void;
  onRequestRefund?: () => void;
  isSubmitting?: boolean;
}

export function DisputePanel({ bookingId, onResolve, onRequestRefund, isSubmitting }: DisputePanelProps) {
  const methods = useForm<ResolveDisputeInput>({
    resolver: zodResolver(resolveDisputeSchema),
    defaultValues: {
      notes: '',
    },
  });

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Resolve Dispute
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form id="dispute-form" onSubmit={methods.handleSubmit(onResolve)} className="space-y-4">
            <FormField name="notes" label="Resolution Notes" description="Final decision explanation.">
              <Input placeholder="Based on chat logs, the provider failed to..." />
            </FormField>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        {onRequestRefund && (
          <Button
            variant="ghost"
            className="mr-auto"
            onClick={onRequestRefund}
            disabled={isSubmitting}
          >
            Request Refund
          </Button>
        )}
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            methods.setValue('action', 'REFUND');
            methods.handleSubmit(onResolve)();
          }}
          disabled={isSubmitting}
        >
          <RotateCcw className="w-4 h-4" />
          Full Refund
        </Button>
        <Button
          className="gap-2"
          onClick={() => {
            methods.setValue('action', 'RELEASE');
            methods.handleSubmit(onResolve)();
          }}
          disabled={isSubmitting}
        >
          <CheckCircle className="w-4 h-4" />
          Release Payment
        </Button>
      </CardFooter>
    </Card>
  );
}
