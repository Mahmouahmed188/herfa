'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Users, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle,
  Bell
} from 'lucide-react';
import { KPICards } from '@/features/dashboard/components/KPICards';
import { RecentActivity } from '@/features/dashboard/components/RecentActivity';
import { VerificationQueue } from '@/features/providers/components/VerificationQueue';
import { DashboardChart } from '@/features/dashboard/components/DashboardCharts';

export default function AdminDashboardPage() {
  const stats = [
    { 
      label: 'Total Users', 
      value: '12,482', 
      trend: '+2.5%', 
      trendType: 'up' as const, 
      icon: Users 
    },
    { 
      label: 'Verified Providers', 
      value: '1,842', 
      trend: '+12%', 
      trendType: 'up' as const, 
      icon: ShieldCheck 
    },
    { 
      label: 'Active Bookings', 
      value: '428', 
      trend: '-1.2%', 
      trendType: 'down' as const, 
      icon: Briefcase 
    },
    { 
      label: 'Total Revenue', 
      value: '142,500 SAR', 
      trend: '+8.4%', 
      trendType: 'up' as const, 
      icon: TrendingUp 
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'USER_REGISTRATION' as const,
      title: 'New User Registered',
      description: 'Ahmed Al-Saud joined as a Client.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    },
    {
      id: '2',
      type: 'PROVIDER_VERIFIED' as const,
      title: 'Provider Verified',
      description: 'QuickFix AC Services documents were approved.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      user: 'Super Admin',
    },
    {
      id: '3',
      type: 'BOOKING_DISPUTE' as const,
      title: 'New Dispute Opened',
      description: 'Booking #HF-9042 has been disputed by the client.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
      id: '4',
      type: 'PAYOUT_PROCESSED' as const,
      title: 'Payout Completed',
      description: 'Processed SAR 4,200 for 12 technicians.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
      user: 'Finance Manager',
    },
  ];

  const revenueData = [
    { label: 'Jan', value: 400 },
    { label: 'Feb', value: 300 },
    { label: 'Mar', value: 600 },
    { label: 'Apr', value: 800 },
    { label: 'May', value: 500 },
    { label: 'Jun', value: 900 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here is what is happening on the platform today.</p>
      </div>

      <KPICards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardChart title="Monthly Revenue (SAR)" data={revenueData} />
        <DashboardChart 
          title="Booking Growth" 
          data={revenueData.map(d => ({ ...d, value: d.value / 2 }))} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity activities={recentActivities} />
        
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Urgent Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg border bg-destructive/5 border-destructive/10">
              <div className="p-2 bg-destructive/10 rounded-full">
                <ShieldCheck className="h-4 w-4 text-destructive" />
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
            <div className="flex items-center gap-4 p-3 rounded-lg border bg-blue-500/5 border-blue-500/10">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Bell className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Broadcast Notification</p>
                <p className="text-xs text-muted-foreground">Scheduled for 8:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <VerificationQueue />
    </div>
  );
}
