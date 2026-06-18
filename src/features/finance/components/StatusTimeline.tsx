'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Payment, Refund } from '../types';
import { CheckCircle2, CreditCard, RefreshCcw, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}

function buildTimeline(payment: Payment, refunds: Refund[]): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${payment.id}-created`,
      title: 'Payment Created',
      description: `Payment created for booking ${payment.bookingId.slice(0, 8)}.`,
      timestamp: payment.createdAt,
      icon: CreditCard,
      tone: 'text-blue-500 bg-blue-500/10',
    },
  ];

  if (payment.status !== 'PENDING') {
    events.push({
      id: `${payment.id}-status`,
      title: payment.status === 'AUTHORIZED' ? 'Payment Authorized' : 'Payment Captured',
      description: `Current status is ${payment.status.toLowerCase().replaceAll('_', ' ')}.`,
      timestamp: payment.updatedAt,
      icon: CheckCircle2,
      tone: 'text-emerald-500 bg-emerald-500/10',
    });
  }

  refunds.forEach((refund) => {
    events.push({
      id: refund.id,
      title: `Refund ${refund.status.toLowerCase().replaceAll('_', ' ')}`,
      description: `${refund.amount.toFixed(2)} SAR • ${refund.reason}`,
      timestamp: refund.createdAt,
      icon: refund.status === 'REJECTED' ? XCircle : RefreshCcw,
      tone: refund.status === 'REJECTED' ? 'text-red-500 bg-red-500/10' : 'text-amber-500 bg-amber-500/10',
    });
  });

  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function StatusTimeline({ payment, refunds = [] }: { payment: Payment; refunds?: Refund[] }) {
  const events = React.useMemo(() => buildTimeline(payment, refunds), [payment, refunds]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="flex gap-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', event.tone)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pb-4 border-b border-slate-200 dark:border-surface-border last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
                      <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">{event.description}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {events.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-gray-400">
              No timeline events available yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
