'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Phone, Calendar, ShieldAlert, ShieldCheck, Loader2, User, Activity, CreditCard, Clock } from 'lucide-react';
import { useUserDetail, useSuspendUser, useReactivateUser } from '@/features/users/hooks/useUsers';
import { useLogAction } from '@/features/audit/hooks/useAudit';
import { Link } from '@/lib/navigation';
import { format } from 'date-fns';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const { data: user, isLoading } = useUserDetail(userId);
  const suspendUser = useSuspendUser();
  const reactivateUser = useReactivateUser();
  const logAction = useLogAction();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-12">
        <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">User not found</h2>
        <Button variant="outline" asChild>
          <Link href="/admin/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground">User ID: {user.id}</p>
        </div>
        <div className="flex gap-2">
          {user.status === 'active' ? (
            <Button
              variant="destructive"
              onClick={() => {
                suspendUser.mutate({ userId, data: { status: 'suspended' } });
                logAction.mutate({ action: 'suspend_user', actorType: 'admin', targetType: 'user', targetId: userId });
              }}
              disabled={suspendUser.isPending}
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Suspend User
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => {
                reactivateUser.mutate({ userId, data: { status: 'reactivated' } });
                logAction.mutate({ action: 'reactivate_user', actorType: 'admin', targetType: 'user', targetId: userId });
              }}
              disabled={reactivateUser.isPending}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Reactivate User
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Phone</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Role</label>
                <Badge variant="outline" className="mt-1 capitalize">{user.role}</Badge>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Status</label>
                <Badge
                  variant={user.status === 'active' ? 'default' : 'destructive'}
                  className="mt-1 capitalize"
                >
                  {user.status}
                </Badge>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Registered</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{format(new Date(user.registrationDate), 'PPP')}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide">Last Login</label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{user.lastLogin ? format(new Date(user.lastLogin), 'PPP') : 'Never'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Activity Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Bookings</span>
              <span className="text-lg font-bold">{user.activitySummary?.totalBookings || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Spent</span>
              <span className="text-lg font-bold">{user.activitySummary?.totalSpent || 0} SAR</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Activity</span>
              <span className="text-sm">{user.activitySummary?.lastActivity ? format(new Date(user.activitySummary.lastActivity), 'PPP') : 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings"><Activity className="w-4 h-4 mr-2" /> Booking History</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="w-4 h-4 mr-2" /> Payments</TabsTrigger>
          <TabsTrigger value="activity"><Clock className="w-4 h-4 mr-2" /> Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardContent className="p-6">
              {user.bookingHistory && user.bookingHistory.length > 0 ? (
                <div className="space-y-4">
                  {user.bookingHistory.map((booking: Record<string, unknown>) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{booking.service}</p>
                        <p className="text-sm text-muted-foreground">Provider: {booking.provider}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(booking.scheduledDate), 'PPP')}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{booking.status}</Badge>
                        <p className="text-sm font-medium mt-1">{booking.totalAmount} SAR</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No booking history available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Payment history will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Activity log will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
