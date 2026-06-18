'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Payment } from '../types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from '@/lib/navigation';
import type { ReactNode } from 'react';

interface PaymentDetailsCardProps {
  payment: Payment;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-200 dark:border-surface-border last:border-0">
      <span className="text-sm text-slate-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white text-right">{value}</span>
    </div>
  );
}

export function PaymentDetailsCard({ payment }: PaymentDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Payment Details</CardTitle>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
              Booking {payment.bookingId.slice(0, 8)} and transaction metadata.
            </p>
          </div>
          <PaymentStatusBadge status={payment.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <DetailRow
          label="Payment ID"
          value={<span className="font-mono text-xs break-all">{payment.id}</span>}
        />
        <DetailRow
          label="Booking"
          value={<span className="font-mono text-xs break-all">{payment.bookingId}</span>}
        />
        <DetailRow
          label="Amount"
          value={`${payment.amount.toFixed(2)} ${payment.currency}`}
        />
        <DetailRow
          label="Method"
          value={payment.paymentMethod}
        />
        <DetailRow
          label="Transaction Ref"
          value={<span className="font-mono text-xs break-all">{payment.transactionRef}</span>}
        />
        <DetailRow
          label="Created"
          value={format(new Date(payment.createdAt), 'PPpp')}
        />
        <DetailRow
          label="Updated"
          value={format(new Date(payment.updatedAt), 'PPpp')}
        />

        <div className="pt-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/finance/history`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View payment history
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
