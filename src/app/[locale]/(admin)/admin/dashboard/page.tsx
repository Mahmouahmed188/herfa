'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Briefcase, DollarSign, Activity, Loader2 } from 'lucide-react';
import { useDashboardOverview, useSystemHealth } from '@/features/dashboard/hooks/useDashboard';
import { SystemHealth } from '@/features/dashboard/components/SystemHealth';
import { KPICards } from '@/features/dashboard/components/KPICards';
import { RecentActivity } from '@/features/dashboard/components/RecentActivity';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: health, isLoading: healthLoading } = useSystemHealth();

  const platformData = overview?.platformOverview;

  const kpiStats = platformData ? [
    {
      label: 'Total Users',
      value: platformData.totalUsers.toLocaleString(),
      trend: `+${platformData.growthRate || 0}%`,
      trendType: (platformData.growthRate || 0) >= 0 ? 'up' as const : 'down' as const,
      icon: Users,
      description: 'registered on platform',
    },
    {
      label: 'Total Providers',
      value: platformData.totalProviders.toLocaleString(),
      trend: `${platformData.activeProviders} active`,
      trendType: 'up' as const,
      icon: Briefcase,
      description: 'service providers',
    },
    {
      label: 'Total Bookings',
      value: platformData.totalBookings.toLocaleString(),
      trend: `${platformData.activeBookings} active`,
      trendType: 'up' as const,
      icon: Activity,
      description: 'bookings placed',
    },
    {
      label: 'Total Revenue',
      value: `${platformData.totalRevenue.toLocaleString()} SAR`,
      trend: `+${platformData.growthRate || 0}%`,
      trendType: (platformData.growthRate || 0) >= 0 ? 'up' as const : 'down' as const,
      icon: DollarSign,
      description: 'total revenue',
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

      {overviewLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <KPICards stats={kpiStats} />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SystemHealth data={health} isLoading={healthLoading} />
        <RecentActivity activities={[]} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformData?.pendingVerifications || 0}</div>
            <p className="text-xs text-muted-foreground">awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformData?.openTickets || 0}</div>
            <p className="text-xs text-muted-foreground">support tickets open</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformData?.openDisputes || 0}</div>
            <p className="text-xs text-muted-foreground">disputes to resolve</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
