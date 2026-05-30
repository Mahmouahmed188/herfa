'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Users, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { VerificationQueue } from '@/features/providers/components/VerificationQueue';

export default function AdminDashboardPage() {
  const stats = [
    { 
      label: 'Total Users', 
      value: '12,482', 
      trend: '+2.5%', 
      trendType: 'up', 
      icon: Users 
    },
    { 
      label: 'Verified Providers', 
      value: '1,842', 
      trend: '+12%', 
      trendType: 'up', 
      icon: ShieldCheck 
    },
    { 
      label: 'Active Bookings', 
      value: '428', 
      trend: '-1.2%', 
      trendType: 'down', 
      icon: Briefcase 
    },
    { 
      label: 'Total Revenue', 
      value: '142,500 SAR', 
      trend: '+8.4%', 
      trendType: 'up', 
      icon: TrendingUp 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here is what is happening on the platform today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                {stat.trendType === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trendType === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.trend}
                </span>
                <span className="text-muted-foreground ml-1 text-[10px]">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-lg">
              Chart/Timeline placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Urgent Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg border bg-destructive/5 border-destructive/10">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium">8 Pending Verifications</p>
                <p className="text-xs text-muted-foreground">High priority queue</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg border bg-orange-500/5 border-orange-500/10">
              <div className="p-2 bg-orange-500/10 rounded-full">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium">2 Active Disputes</p>
                <p className="text-xs text-muted-foreground">Awaiting resolution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <VerificationQueue />
    </div>
  );
}
