'use client';

import * as React from 'react';
import { useTickets, useUpdateTicketStatus, useAssignTicket, useEscalateTicket } from '../hooks/useSupport';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SupportTicket } from '../services/api';
import { format } from 'date-fns';
import { SearchFilter } from '@/components/ui/filters/SearchFilter';
import { useSearchParams } from 'next/navigation';
import { Dialog } from '@/components/ui/feedback/Dialog';
import { FormField } from '@/components/ui/forms/FormField';
import { Input } from '@/components/ui/input';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowUpCircle, UserPlus, AlertTriangle } from 'lucide-react';

const assignSchema = z.object({ userId: z.string().min(1, 'User ID is required') });
const escalateSchema = z.object({ reason: z.string().min(10, 'Reason must be at least 10 characters') });

const priorityColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  LOW: 'secondary',
  MEDIUM: 'outline',
  HIGH: 'destructive',
  URGENT: 'destructive',
};

const statusColors: Record<string, 'default' | 'secondary' | 'outline'> = {
  OPEN: 'outline',
  IN_PROGRESS: 'default',
  WAITING: 'secondary',
  RESOLVED: 'secondary',
  CLOSED: 'default',
};

export function SupportTicketList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || undefined;
  const priority = searchParams.get('priority') || undefined;

  const { data, isLoading } = useTickets({ page, status, priority });
  const updateStatus = useUpdateTicketStatus();
  const assignMutation = useAssignTicket();
  const escalateMutation = useEscalateTicket();

  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicket | null>(null);
  const [isAssignOpen, setIsAssignOpen] = React.useState(false);
  const [isEscalateOpen, setIsEscalateOpen] = React.useState(false);

  const assignMethods = useForm<{ userId: string }>({
    resolver: zodResolver(assignSchema),
    defaultValues: { userId: '' },
  });

  const escalateMethods = useForm<{ reason: string }>({
    resolver: zodResolver(escalateSchema),
    defaultValues: { reason: '' },
  });

  const columns = [
    {
      header: 'Ticket',
      accessorKey: 'subject',
      cell: (row: SupportTicket) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.subject}</span>
          <span className="text-xs text-muted-foreground">{row.category}</span>
        </div>
      ),
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (row: SupportTicket) => (
        <Badge variant={priorityColors[row.priority]}>{row.priority}</Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: SupportTicket) => (
        <Badge variant={statusColors[row.status]}>{row.status.replace('_', ' ')}</Badge>
      ),
    },
    {
      header: 'Assigned To',
      accessorKey: 'assignedTo',
      cell: (row: SupportTicket) => (
        <span className="text-sm">{row.assignedTo?.name || 'Unassigned'}</span>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: (row: SupportTicket) => format(new Date(row.createdAt), 'PP'),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: SupportTicket) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateStatus.mutate({ id: row.id, status: 'IN_PROGRESS' })}
            title="Start processing"
          >
            <ArrowUpCircle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSelectedTicket(row); setIsAssignOpen(true); }}
            title="Assign"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setSelectedTicket(row); setIsEscalateOpen(true); }}
            title="Escalate"
          >
            <AlertTriangle className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
      </div>
      <div className="flex items-center gap-4">
        <SearchFilter />
      </div>
      <DataTable data={data?.data || []} columns={columns} isLoading={isLoading} />

      <Dialog isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} title="Assign Ticket">
        <FormProvider {...assignMethods}>
          <form onSubmit={assignMethods.handleSubmit((v) => {
            if (selectedTicket) {
              assignMutation.mutate({ id: selectedTicket.id, userId: v.userId });
              setIsAssignOpen(false);
            }
          })} className="space-y-4 pt-4">
            <FormField name="userId" label="Support Agent ID">
              <Input placeholder="Enter agent user ID..." />
            </FormField>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
              <Button type="submit">Assign</Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>

      <Dialog isOpen={isEscalateOpen} onClose={() => setIsEscalateOpen(false)} title="Escalate Ticket">
        <FormProvider {...escalateMethods}>
          <form onSubmit={escalateMethods.handleSubmit((v) => {
            if (selectedTicket) {
              escalateMutation.mutate({ id: selectedTicket.id, reason: v.reason });
              setIsEscalateOpen(false);
            }
          })} className="space-y-4 pt-4">
            <FormField name="reason" label="Escalation Reason">
              <Input placeholder="Why is this being escalated?" />
            </FormField>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsEscalateOpen(false)}>Cancel</Button>
              <Button type="submit" variant="destructive">Escalate</Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default SupportTicketList;
