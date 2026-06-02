'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useUserDetails, useUpdateUserStatus, useUserActivity } from '@/features/users/hooks/useUsers';
import { Loading } from '@/components/common/Loading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, ShieldAlert, ShieldCheck, History, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog } from '@/components/ui/feedback/Dialog';
import { FormField } from '@/components/ui/forms/FormField';
import { Input } from '@/components/ui/input';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const statusSchema = z.object({
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

export default function UserDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: userResponse, isLoading: isUserLoading } = useUserDetails(id);
  const { data: activityResponse, isLoading: isActivityLoading } = useUserActivity(id);
  const updateStatus = useUpdateUserStatus();

  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false);
  const [targetStatus, setTargetStatus] = React.useState<'ACTIVE' | 'SUSPENDED'>('SUSPENDED');

  const methods = useForm<{ reason: string }>({
    resolver: zodResolver(statusSchema),
    defaultValues: { reason: '' },
  });

  if (isUserLoading || isActivityLoading) return <Loading fullPage />;
  if (!userResponse?.data) return <div className="p-8 text-center">User not found</div>;

  const user = userResponse.data;

  const handleStatusChange = (values: { reason: string }) => {
    updateStatus.mutate(
      { id, status: targetStatus, reason: values.reason },
      { onSuccess: () => setIsStatusDialogOpen(false) }
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.firstName} {user.lastName}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Badge variant="outline" className="capitalize">{user.role.toLowerCase()}</Badge>
              <span>•</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user.status === 'ACTIVE' ? (
            <Button 
              variant="outline" 
              className="text-destructive border-destructive hover:bg-destructive/10 gap-2"
              onClick={() => {
                setTargetStatus('SUSPENDED');
                setIsStatusDialogOpen(true);
              }}
            >
              <ShieldAlert className="w-4 h-4" />
              Suspend Account
            </Button>
          ) : (
            <Button 
              className="gap-2"
              onClick={() => {
                setTargetStatus('ACTIVE');
                setIsStatusDialogOpen(true);
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              Activate Account
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Status</p>
              <Badge variant={user.status === 'ACTIVE' ? 'default' : 'destructive'} className="mt-1">
                {user.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Member Since</p>
              <p className="flex items-center gap-2 mt-1 text-sm"><Calendar className="w-3 h-3" /> {format(new Date(user.createdAt), 'PPP')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Last Update</p>
              <p className="text-sm mt-1">{format(new Date(user.updatedAt), 'PPP')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-4 h-4" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activityResponse?.data?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 italic">No recent activity recorded.</p>
              ) : (
                activityResponse?.data?.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(item.timestamp), 'PPpp')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        title={targetStatus === 'SUSPENDED' ? 'Suspend User Account' : 'Activate User Account'}
        description={`Are you sure you want to change this user's status to ${targetStatus.toLowerCase()}?`}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleStatusChange)} className="space-y-4 pt-4">
            <FormField name="reason" label="Reason for Change" description="This action will be logged in the audit trail.">
              <Input placeholder="Policy violation, suspicious activity, etc." />
            </FormField>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant={targetStatus === 'SUSPENDED' ? 'destructive' : 'default'}
                disabled={updateStatus.isPending}
              >
                Confirm Status Change
              </Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
