'use client';

import * as React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartContainer } from './chart-container';

const DEFAULT_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2, 215 100% 50%))',
  'hsl(var(--chart-3, 35 100% 50%))',
  'hsl(var(--chart-4, 160 60% 45%))',
  'hsl(var(--chart-5, 280 60% 60%))',
];

interface PieChartProps {
  title: string;
  data: { label: string; value: number; color?: string }[];
  description?: string;
  className?: string;
}

export function PieChart({ title, data, description, className }: PieChartProps) {
  return (
    <ChartContainer title={title} description={description} className={className}>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.label}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--background))',
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
