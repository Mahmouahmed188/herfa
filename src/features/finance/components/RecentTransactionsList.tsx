'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Payment } from '../types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { format } from 'date-fns';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Link } from '@/lib/navigation';

interface RecentTransactionsListProps {
  transactions: Payment[];
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function RecentTransactionsList({ transactions, isLoading, isError, onRetry }: RecentTransactionsListProps) {
  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold">Failed to load recent transactions</h2>
          {onRetry && (
            <button onClick={onRetry} className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">
              Retry
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-slate-500 dark:text-gray-400">
          No recent transactions available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((payment) => (
        <Card key={payment.id}>
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white">{payment.bookingId.slice(0, 8)}</p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                {format(new Date(payment.createdAt), 'PPp')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                {payment.amount.toFixed(2)} {payment.currency}
              </span>
              <PaymentStatusBadge status={payment.status} />
              <Link
                href={{ pathname: '/finance/[id]', params: { id: payment.id } }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                View
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
