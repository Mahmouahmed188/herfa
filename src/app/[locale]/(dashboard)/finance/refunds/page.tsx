'use client';

import { useSearchParams } from 'next/navigation';
import { useRefunds } from '@/features/finance/hooks/useRefunds';
import { RefundRequestForm } from '@/features/finance/components/RefundRequestForm';
import { RefundTrackingList } from '@/features/finance/components/RefundTrackingList';
import { Card, CardContent } from '@/components/ui/card';

export default function RefundsPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId') || undefined;
  const refundsQuery = useRefunds({ limit: 20, paymentId: searchParams.get('paymentId') || undefined });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Refund Tracking</h1>
        <p className="text-muted-foreground">Submit a refund request and follow its progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RefundRequestForm bookingId={bookingId} paymentId={searchParams.get('paymentId') || undefined} />
        <Card>
          <CardContent className="p-6 space-y-3 text-sm text-slate-600 dark:text-gray-300">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">How it works</h2>
            <p>Refund requests are reviewed by the support team and tracked here after submission.</p>
            {bookingId && (
              <p>
                Active booking reference: <span className="font-mono">{bookingId}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <RefundTrackingList
        refunds={refundsQuery.data?.data || []}
        isLoading={refundsQuery.isLoading}
        isError={refundsQuery.isError}
        onRetry={() => refundsQuery.refetch()}
      />
    </div>
  );
}
