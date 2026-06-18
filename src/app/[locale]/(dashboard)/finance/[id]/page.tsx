'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { financeApi } from '@/features/finance/services/api';
import { PaymentDetailsCard } from '@/features/finance/components/PaymentDetailsCard';
import { StatusTimeline } from '@/features/finance/components/StatusTimeline';
import { RefundTrackingList } from '@/features/finance/components/RefundTrackingList';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/lib/navigation';
import { Payment } from '@/features/finance/types';

export default function FinancePaymentDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const routeId = params.id as string;
  const bookingId = searchParams.get('bookingId') || routeId;

  const paymentQuery = useQuery<Payment | null>({
    queryKey: ['finance', 'payment-details', routeId, bookingId],
    queryFn: async () => {
      try {
        const response = await financeApi.getPaymentDetails(routeId);
        if (response.data) return response.data;
      } catch {
        // Fallback to booking lookup below.
      }

      const searchResponse = await financeApi.getPayments({ limit: 100 });
      return searchResponse.data.find((payment) => payment.id === routeId || payment.bookingId === bookingId) || null;
    },
    enabled: !!routeId,
  });

  const refundsQuery = useQuery({
    queryKey: ['finance', 'refunds', paymentQuery.data?.id],
    queryFn: () => financeApi.getRefunds({ limit: 20, paymentId: paymentQuery.data?.id }),
    enabled: !!paymentQuery.data?.id,
  });

  if (paymentQuery.isLoading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading payment details...</div>;
  }

  if (!paymentQuery.data) {
    return (
      <div className="space-y-4 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <h1 className="text-xl font-semibold">Payment not found</h1>
            <p className="text-sm text-slate-500 dark:text-gray-400">We could not locate a payment for this reference.</p>
            <Link href="/finance/history" className="inline-flex text-primary font-semibold hover:underline">
              Back to payment history
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const payment = paymentQuery.data;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment {payment.id.slice(0, 8)}</h1>
        <p className="text-muted-foreground">Booking reference {payment.bookingId.slice(0, 8)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentDetailsCard payment={payment} />
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Quick Links</h2>
            <div className="space-y-2 text-sm">
              <Link href="/finance/history" className="block text-primary font-semibold hover:underline">
                Payment history
              </Link>
              <Link href="/finance/refunds" className="block text-primary font-semibold hover:underline">
                Refund tracking
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusTimeline payment={payment} refunds={refundsQuery.data?.data || []} />
        <RefundTrackingList
          refunds={refundsQuery.data?.data || []}
          isLoading={refundsQuery.isLoading}
          isError={refundsQuery.isError}
          onRetry={() => refundsQuery.refetch()}
        />
      </div>
    </div>
  );
}
