'use client';

import * as React from 'react';
import { useRetentionReport } from '../hooks/useAnalytics';
import { Loading } from '@/components/common/Loading';
import { LineChart } from '@/components/ui/charts';

export function RetentionChart() {
  const { data, isLoading } = useRetentionReport();

  if (isLoading) return <Loading fullPage />;
  if (!data?.data) return null;

  const chartData = data.data.labels.map((label, i) => ({
    label,
    value: data.data.datasets[0]?.values[i] || 0,
  }));

  return (
    <LineChart
      title="User Retention"
      data={chartData}
      description="Cohort retention over time"
    />
  );
}
