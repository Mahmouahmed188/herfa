'use client';
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail';
  message: string;
}

interface SystemHealthData {
  status: 'healthy' | 'warning' | 'critical';
  checks: HealthCheck[];
  lastChecked: string;
  uptime: number;
}

interface SystemHealthProps {
  data?: SystemHealthData;
  isLoading?: boolean;
}

export function SystemHealth({ data, isLoading }: SystemHealthProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No health data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>System Health</CardTitle>
        <Badge
          variant={
            data.status === 'healthy' ? 'default' :
            data.status === 'warning' ? 'secondary' :
            'destructive'
          }
        >
          {data.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-4">
          Uptime: {Math.floor(data.uptime / 3600)}h {Math.floor((data.uptime % 3600) / 60)}m
          &nbsp;•&nbsp; Last checked: {new Date(data.lastChecked).toLocaleTimeString()}
        </div>
        <div className="space-y-2">
          {data.checks.map((check) => (
            <div key={check.name} className="flex items-center justify-between text-sm">
              <span>{check.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{check.message}</span>
                {check.status === 'pass' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
