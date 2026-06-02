'use client';

import * as React from 'react';
import { useConversionFunnel } from '../hooks/useAnalytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loading } from '@/components/common/Loading';
import { cn } from '@/lib/utils';

export function ConversionFunnel() {
  const { data, isLoading } = useConversionFunnel();

  if (isLoading) return <Loading fullPage />;
  if (!data?.data?.length) return null;

  const stages = data.data;
  const maxCount = Math.max(...stages.map(s => s.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage, i) => (
          <div key={stage.stage} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{stage.stage}</span>
              <span className="text-muted-foreground">
                {stage.count.toLocaleString()} ({stage.rate}%)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-500',
                  i === 0 ? 'bg-primary' : i === stages.length - 1 ? 'bg-green-500' : 'bg-primary/60'
                )}
                style={{ width: `${(stage.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default ConversionFunnel;
