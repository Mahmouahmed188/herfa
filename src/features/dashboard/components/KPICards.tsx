'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: string | number;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  description?: string;
}

export function KPICard({
  label,
  value,
  trend,
  trendType,
  icon: Icon,
  description = 'from last month',
}: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs mt-1">
          {trendType === 'up' && (
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          )}
          {trendType === 'down' && (
            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span
            className={cn(
              trendType === 'up' && 'text-green-500',
              trendType === 'down' && 'text-red-500',
              trendType === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trend}
          </span>
          <span className="text-muted-foreground ml-1 text-[10px]">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICards({ stats }: { stats: KPICardProps[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <KPICard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
