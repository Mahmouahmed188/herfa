'use client';

import { AlertCircle, Loader2, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Refund } from '../types';

const refundStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  REQUESTED: { label: 'Requested', variant: 'secondary' },
  UNDER_REVIEW: { label: 'Under Review', variant: 'outline' },
  APPROVED: { label: 'Approved', variant: 'default' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  PROCESSED: { label: 'Processed', variant: 'outline' },
  COMPLETED: { label: 'Completed', variant: 'default' },
};

interface RefundTrackingListProps {
  refunds: Refund[];
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function RefundTrackingList({ refunds, isLoading, isError, onRetry }: RefundTrackingListProps) {
  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold">Failed to load refund requests</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 mb-4">Please try again.</p>
          {onRetry && (
            <button onClick={onRetry} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold">
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

  if (refunds.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <RefreshCcw className="w-10 h-10 text-primary mb-4" />
          <h2 className="text-lg font-semibold">No refund requests yet</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Submitted refund requests will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {refunds.map((refund) => {
        const config = refundStatusConfig[refund.status] || refundStatusConfig.REQUESTED;
        return (
          <Card key={refund.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{refund.reason}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-mono break-all">
                    Payment {refund.paymentId.slice(0, 8)}
                  </p>
                </div>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-gray-400">
                <span>{refund.amount.toFixed(2)} SAR</span>
                <span>{new Date(refund.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
