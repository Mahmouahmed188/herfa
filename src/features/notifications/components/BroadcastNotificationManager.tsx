'use client';

import * as React from 'react';
import { useBroadcasts, useSendBroadcast } from '../hooks/useNotifications';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send, Plus } from 'lucide-react';
import { BroadcastNotification } from '../services/api';
import { Dialog } from '@/components/ui/feedback/Dialog';
import { FormField } from '@/components/ui/forms/FormField';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

const broadcastSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  target: z.enum(['ALL', 'CLIENTS', 'PROVIDERS']),
  type: z.enum(['PUSH', 'SMS', 'EMAIL']),
});

type BroadcastInput = z.infer<typeof broadcastSchema>;

export function BroadcastNotificationManager() {
  const { data, isLoading } = useBroadcasts();
  const sendMutation = useSendBroadcast();
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const methods = useForm<BroadcastInput>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: '',
      message: '',
      target: 'ALL',
      type: 'PUSH',
    },
  });

  const onSubmit = (values: BroadcastInput) => {
    sendMutation.mutate(values, {
      onSuccess: () => {
        setIsDialogOpen(false);
        methods.reset();
      },
    });
  };

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Target',
      accessorKey: 'target',
      cell: (row: BroadcastNotification) => (
        <Badge variant="outline">{row.target}</Badge>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (row: BroadcastNotification) => (
        <span className="text-xs font-semibold">{row.type}</span>
      ),
    },
    {
      header: 'Sent At',
      accessorKey: 'createdAt',
      cell: (row: BroadcastNotification) => format(new Date(row.createdAt), 'PPpp'),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: BroadcastNotification) => (
        <Badge variant={row.status === 'SENT' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Broadcast Notifications</h2>
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          New Broadcast
        </Button>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Send New Broadcast"
        description="This will send a notification to the selected target segment immediately."
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField name="title" label="Notification Title">
              <Input placeholder="Update available, system maintenance, etc." />
            </FormField>
            <FormField name="message" label="Notification Message">
              <Input placeholder="Enter the content of the notification..." />
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField name="target" label="Target Audience">
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...methods.register('target')}
                >
                  <option value="ALL">All Users</option>
                  <option value="CLIENTS">Clients Only</option>
                  <option value="PROVIDERS">Providers Only</option>
                </select>
              </FormField>
              <FormField name="type" label="Channel">
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...methods.register('type')}
                >
                  <option value="PUSH">Push Notification</option>
                  <option value="SMS">SMS Message</option>
                  <option value="EMAIL">Email</option>
                </select>
              </FormField>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={sendMutation.isPending} className="gap-2">
                <Send className="w-4 h-4" />
                Send Immediately
              </Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
