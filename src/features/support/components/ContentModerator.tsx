'use client';

import * as React from 'react';
import { useContentReports, useResolveReport } from '../hooks/useSupport';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentReport } from '../services/api';
import { format } from 'date-fns';
import { Dialog } from '@/components/ui/feedback/Dialog';
import { FormField } from '@/components/ui/forms/FormField';
import { Input } from '@/components/ui/input';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, XCircle } from 'lucide-react';

const resolveSchema = z.object({ resolution: z.string().min(5, 'Resolution note required') });

export function ContentModerator() {
  const { data, isLoading } = useContentReports({ status: 'PENDING' });
  const resolveReport = useResolveReport();

  const [selectedReport, setSelectedReport] = React.useState<ContentReport | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [resolveAction, setResolveAction] = React.useState<'RESOLVED' | 'DISMISSED'>('RESOLVED');

  const methods = useForm<{ resolution: string }>({
    resolver: zodResolver(resolveSchema),
    defaultValues: { resolution: '' },
  });

  const columns = [
    {
      header: 'Type',
      accessorKey: 'contentType',
      cell: (row: ContentReport) => <Badge variant="outline">{row.contentType}</Badge>,
    },
    {
      header: 'Reported By',
      accessorKey: 'reportedBy',
      cell: (row: ContentReport) => row.reportedBy.name,
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (row: ContentReport) => (
        <span className="text-sm max-w-[250px] block truncate">{row.reason}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: ContentReport) => (
        <Badge variant={row.status === 'PENDING' ? 'destructive' : 'default'}>{row.status}</Badge>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: (row: ContentReport) => format(new Date(row.createdAt), 'PP'),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: ContentReport) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-green-500"
            onClick={() => {
              setSelectedReport(row);
              setResolveAction('RESOLVED');
              setIsDialogOpen(true);
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => {
              setSelectedReport(row);
              setResolveAction('DISMISSED');
              setIsDialogOpen(true);
            }}
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Content Moderation</h2>
      <p className="text-sm text-muted-foreground">Review and resolve reported content across the platform.</p>
      <DataTable data={data?.data || []} columns={columns} isLoading={isLoading} />

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={resolveAction === 'RESOLVED' ? 'Resolve Report' : 'Dismiss Report'}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit((v) => {
            if (selectedReport) {
              resolveReport.mutate({ id: selectedReport.id, resolution: v.resolution, action: resolveAction });
              setIsDialogOpen(false);
              methods.reset();
            }
          })} className="space-y-4 pt-4">
            <FormField name="resolution" label="Resolution Notes">
              <Input placeholder="Describe the action taken..." />
            </FormField>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{resolveAction === 'RESOLVED' ? 'Resolve' : 'Dismiss'}</Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
