'use client';

import * as React from 'react';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface DashboardChartsProps {
  revenueData: ChartData[];
  bookingData: ChartData[];
  distributionData?: ChartData[];
}

export function DashboardCharts({ revenueData, bookingData, distributionData }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="md:col-span-2 lg:col-span-3">
        <BarChart
          title="Monthly Revenue (SAR)"
          data={revenueData}
          description="Revenue trends over the past months"
        />
      </div>
      <div className="md:col-span-2 lg:col-span-2">
        <LineChart
          title="Booking Growth"
          data={bookingData}
          description="Number of bookings per month"
        />
      </div>
      {distributionData && (
        <div className="md:col-span-2 lg:col-span-2">
          <PieChart
            title="Booking Distribution"
            data={distributionData}
            description="By service category"
          />
        </div>
      )}
    </div>
  );
}
