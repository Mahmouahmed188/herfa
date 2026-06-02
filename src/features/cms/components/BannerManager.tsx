'use client';

import * as React from 'react';
import { useBanners, useCreateBanner, useUpdateBanner } from '../hooks/useCms';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit2 } from 'lucide-react';
import { Banner } from '../services/api';
import { Dialog } from '@/components/ui/feedback/Dialog';
import { FormField } from '@/components/ui/forms/FormField';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

const bannerSchema = z.object({
  titleAr: z.string().min(2, 'Arabic title required'),
  titleEn: z.string().min(2, 'English title required'),
  linkUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  priority: z.coerce.number().min(0).max(999),
  status: z.enum(['ACTIVE', 'SCHEDULED', 'EXPIRED']),
  scheduledAt: z.string().optional(),
});

type BannerInput = z.infer<typeof bannerSchema>;

export function BannerManager() {
  const { data, isLoading } = useBanners();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBanner, setEditingBanner] = React.useState<Banner | null>(null);

  const methods = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: { titleAr: '', titleEn: '', linkUrl: '', priority: 0, status: 'ACTIVE', scheduledAt: '' },
  });

  const onSubmit = (values: BannerInput) => {
    if (editingBanner) {
      updateMutation.mutate(
        { id: editingBanner.id, data: values as any },
        { onSuccess: () => setIsDialogOpen(false) }
      );
    } else {
      createMutation.mutate(values as any, {
        onSuccess: () => { setIsDialogOpen(false); methods.reset(); },
      });
    }
  };

  const columns = [
    {
      header: 'Title (AR)',
      accessorKey: 'titleAr',
    },
    {
      header: 'Title (EN)',
      accessorKey: 'titleEn',
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: Banner) => (
        <Badge variant={row.status === 'ACTIVE' ? 'default' : row.status === 'SCHEDULED' ? 'secondary' : 'outline'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Scheduled',
      accessorKey: 'scheduledAt',
      cell: (row: Banner) => row.scheduledAt ? format(new Date(row.scheduledAt), 'PP') : '-',
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: Banner) => (
        <Button variant="ghost" size="icon" onClick={() => {
          setEditingBanner(row);
          methods.reset(row as any);
          setIsDialogOpen(true);
        }}>
          <Edit2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Banner Management</h2>
        <Button className="gap-2" onClick={() => { setEditingBanner(null); methods.reset(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>
      <DataTable data={data?.data || []} columns={columns} isLoading={isLoading} />

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={editingBanner ? 'Edit Banner' : 'New Banner'}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="titleAr" label="Title (Arabic)"><Input placeholder="عنوان البانر" /></FormField>
              <FormField name="titleEn" label="Title (English)"><Input placeholder="Banner title" /></FormField>
            </div>
            <FormField name="linkUrl" label="Link URL"><Input placeholder="https://..." /></FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="priority" label="Priority"><Input type="number" /></FormField>
              <FormField name="scheduledAt" label="Schedule (optional)"><Input type="datetime-local" /></FormField>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingBanner ? 'Save Changes' : 'Create Banner'}</Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default BannerManager;
