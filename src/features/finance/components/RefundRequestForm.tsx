'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateTicket } from '@/features/support/hooks/useSupport';

const refundRequestSchema = z.object({
  reason: z.string().min(10, 'Please add at least 10 characters.'),
  amount: z.string().optional(),
});

type RefundRequestValues = z.infer<typeof refundRequestSchema>;

interface RefundRequestFormProps {
  bookingId?: string;
  paymentId?: string;
}

export function RefundRequestForm({ bookingId, paymentId }: RefundRequestFormProps) {
  const createTicket = useCreateTicket();
  const form = useForm<RefundRequestValues>({
    resolver: zodResolver(refundRequestSchema),
    defaultValues: { reason: '', amount: '' },
  });

  const handleSubmit = form.handleSubmit((values) => {
    createTicket.mutate(
      {
        subject: bookingId ? `Refund request for booking ${bookingId.slice(0, 8)}` : 'Refund request',
        description: [
          `Refund reason: ${values.reason}`,
          values.amount ? `Requested amount: ${values.amount}` : null,
          bookingId ? `Booking ID: ${bookingId}` : null,
          paymentId ? `Payment ID: ${paymentId}` : null,
        ]
          .filter(Boolean)
          .join('\n'),
        priority: 'MEDIUM',
        category: 'DISPUTE',
        relatedBookingId: bookingId,
        relatedPaymentId: paymentId,
      },
      { onSuccess: () => form.reset({ reason: '', amount: '' }) }
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a Refund</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-gray-200">Reason</label>
            <textarea
              {...form.register('reason')}
              rows={5}
              className="w-full rounded-xl border border-slate-200 dark:border-surface-border bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Explain why you are requesting a refund"
            />
            {form.formState.errors.reason && (
              <p className="text-xs text-red-500">{form.formState.errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-gray-200">Requested Amount</label>
            <Input {...form.register('amount')} placeholder="Optional" />
          </div>

          {bookingId && (
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Booking reference: <span className="font-mono">{bookingId}</span>
            </p>
          )}

          <Button type="submit" className="w-full" disabled={createTicket.isPending}>
            {createTicket.isPending ? 'Submitting...' : 'Submit Refund Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
