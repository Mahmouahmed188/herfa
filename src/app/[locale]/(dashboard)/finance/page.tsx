'use client';

import * as React from 'react';
import { PayoutTable } from '@/features/finance/components/PayoutTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, ArrowDownCircle, Users } from 'lucide-react';
import { useRevenueStats } from '@/features/finance/hooks/usePayouts';

export default function FinancePage() {
  const { data: stats } = useRevenueStats();

  const kpis = [
    { name: 'Total Revenue', value: '45,231 SAR', trend: '+12%', icon: TrendingUp },
    { name: 'Pending Payouts', value: '12,400 SAR', trend: '8 requests', icon: Wallet },
    { name: 'Average Commission', value: '15%', trend: 'Fixed', icon: ArrowDownCircle },
    { name: 'Active Wallets', value: '1,204', trend: '+3% this week', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
        <p className="text-muted-foreground">Monitor revenue, process payouts, and track provider wallets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <PayoutTable />
        </CardContent>
      </Card>
    </div>
  );
}
