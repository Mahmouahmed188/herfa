'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProviderEarnings, useProviderPayments } from '../hooks/usePayments';
import { EarningsKpiCards } from './EarningsKpiCards';
import { RecentTransactionsList } from './RecentTransactionsList';

export function ProviderEarningsDashboard() {
  const earningsQuery = useProviderEarnings();
  const transactionsQuery = useProviderPayments({ limit: 5 });

  const summary = earningsQuery.data?.data ?? null;
  const transactions = transactionsQuery.data?.data ?? [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground text-sm mt-1">Track completed payments, pending balances, and refunds.</p>
        </div>
        <Button>Withdraw Funds</Button>
      </div>

      <EarningsKpiCards summary={summary} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RecentTransactionsList
            transactions={transactions}
            isLoading={transactionsQuery.isLoading}
            isError={transactionsQuery.isError}
            onRetry={() => transactionsQuery.refetch()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
