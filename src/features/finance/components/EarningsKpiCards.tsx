'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowDownCircle, CreditCard, TrendingUp } from 'lucide-react';
import { FinancialSummary } from '../types';

interface EarningsKpiCardsProps {
  summary?: FinancialSummary | null;
}

function formatMoney(value?: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(value || 0);
}

export function EarningsKpiCards({ summary }: EarningsKpiCardsProps) {
  const cards = [
    { title: 'Total Earnings', value: formatMoney(summary?.totalEarnings), icon: TrendingUp },
    { title: 'Pending Earnings', value: formatMoney(summary?.pendingEarnings), icon: Wallet },
    { title: 'Total Refunds', value: formatMoney(summary?.totalRefunds), icon: ArrowDownCircle },
    { title: 'Transactions', value: String(summary?.transactionCount ?? 0), icon: CreditCard },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
