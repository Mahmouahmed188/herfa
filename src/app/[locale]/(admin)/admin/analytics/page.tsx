'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRevenueOverview, useUserAnalytics, useProviderAnalytics, useBookingAnalytics, useReviewAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { Loading } from '@/components/common/Loading';

export default function AnalyticsPage() {
  const [period, setPeriod] = React.useState('30d');
  const { data: revenueData, isLoading: revenueLoading } = useRevenueOverview({ period });
  const { data: userData, isLoading: userLoading } = useUserAnalytics({ period });
  const { data: providerData, isLoading: providerLoading } = useProviderAnalytics({ period });
  const { data: bookingData, isLoading: bookingLoading } = useBookingAnalytics({ period });
  const { isLoading: reviewLoading } = useReviewAnalytics({ period });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Total Revenue</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenueLoading ? '...' : `${(revenueData as Record<string, unknown>)?.totalRevenue?.toLocaleString() || 0} SAR`}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Total Users</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userLoading ? '...' : (userData as Record<string, unknown>)?.userGrowth?.current?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Active Providers</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{providerLoading ? '...' : (providerData as Record<string, unknown>)?.providerGrowth?.current?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Total Bookings</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookingLoading ? '...' : (bookingData as Record<string, unknown>)?.totalBookings?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Revenue Trends</CardTitle></CardHeader>
            <CardContent>
              {revenueLoading ? <Loading /> : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Revenue chart will display here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>User Analytics</CardTitle></CardHeader>
            <CardContent>
              {userLoading ? <Loading /> : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  User analytics chart will display here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Provider Analytics</CardTitle></CardHeader>
            <CardContent>
              {providerLoading ? <Loading /> : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Provider analytics chart will display here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Booking Analytics</CardTitle></CardHeader>
            <CardContent>
              {bookingLoading ? <Loading /> : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Booking analytics chart will display here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Review Analytics</CardTitle></CardHeader>
            <CardContent>
              {reviewLoading ? <Loading /> : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Review analytics chart will display here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
