'use client';

import * as React from 'react';
import { useAnalyticsOverview } from '../hooks/useAnalytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loading } from '@/components/common/Loading';
import { Users, Briefcase, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalyticsOverview() {
  const { data, isLoading } = useAnalyticsOverview();

  if (isLoading) return <Loading fullPage />;
  if (!data?.data) return <div className="p-8 text-center text-muted-foreground">No analytics data available</div>;

  const stats = data.data;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), growth: stats.userGrowth, icon: Users },
    { label: 'Total Bookings', value: stats.totalBookings.toLocaleString(), growth: stats.bookingGrowth, icon: Briefcase },
    { label: 'Total Revenue', value: `${stats.totalRevenue.toLocaleString()} SAR`, growth: stats.revenueGrowth, icon: DollarSign },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, growth: 0, icon: TrendingUp },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isUp = card.growth >= 0;
        return (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.growth !== 0 && (
                <div className="flex items-center text-xs mt-1">
                  {isUp ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={cn(isUp ? 'text-green-500' : 'text-red-500')}>
                    {isUp ? '+' : ''}{card.growth}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
