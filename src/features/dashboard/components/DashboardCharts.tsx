'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartProps {
  title: string;
  data: { label: string; value: number; color?: string }[];
  type?: 'bar' | 'line';
  className?: string;
}

/**
 * A stylized chart placeholder using pure CSS/Tailwind.
 * Aligns with the "New Applications" mandate for visually complete prototypes.
 */
export function DashboardChart({ title, data, type = 'bar', className }: ChartProps) {
  const max = Math.max(...data.map(d => d.value));

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end gap-2 pt-4">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div 
                className={cn(
                  "w-full rounded-t-sm transition-all duration-500 bg-primary/20 group-hover:bg-primary/40",
                  item.color
                )}
                style={{ height: `${(item.value / max) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
