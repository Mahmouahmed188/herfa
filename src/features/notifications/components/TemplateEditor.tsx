'use client';

import * as React from 'react';
import { useTemplates, useCreateTemplate, useUpdateTemplate } from '../hooks/useNotifications';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit2 } from 'lucide-react';
import { Dialog } from '@/components/ui/feedback/Dialog';
import { FormField } from '@/components/ui/forms/FormField';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

const templateSchema = z.object({
  name: z.string().min(3, 'Template name required'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  body: z.string().min(20, 'Body must be at least 20 characters'),
  channel: z.enum(['PUSH', 'SMS', 'EMAIL']),
  placeholders: z.string().optional(),
});

type TemplateInput = z.infer<typeof templateSchema>;

const PLACEHOLDER_HINT = 'Use {{placeholder_name}} syntax. Available: {{user_name}}, {{provider_name}}, {{booking_id}}, {{amount}}, {{date}}';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  channel: 'PUSH' | 'SMS' | 'EMAIL';
  placeholders?: string;
  createdAt: string;
  updatedAt: string;
}

export function TemplateEditor() {
  const { data, isLoading } = useTemplates();
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<Template | null>(null);

  const methods = useForm<TemplateInput>({
    resolver: zodResolver(templateSchema),
    defaultValues: { name: '', subject: '', body: '', channel: 'EMAIL', placeholders: '' },
  });

  const onSubmit = (values: TemplateInput) => {
    if (editingTemplate) {
      updateMutation.mutate(
        { id: editingTemplate.id, data: values as any },
        { onSuccess: () => setIsDialogOpen(false) }
      );
    } else {
      createMutation.mutate(values as any, {
        onSuccess: () => { setIsDialogOpen(false); methods.reset(); },
      });
    }
  };

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    {
      header: 'Channel',
      accessorKey: 'channel',
      cell: (row: Template) => <Badge variant="outline">{row.channel}</Badge>,
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
      cell: (row: Template) => <span className="text-sm max-w-[200px] block truncate">{row.subject}</span>,
    },
    {
      header: 'Updated',
      accessorKey: 'updatedAt',
      cell: (row: Template) => format(new Date(row.updatedAt), 'PP'),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: Template) => (
        <Button variant="ghost" size="icon" onClick={() => {
          setEditingTemplate(row);
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
        <h2 className="text-2xl font-bold tracking-tight">Notification Templates</h2>
        <Button className="gap-2" onClick={() => { setEditingTemplate(null); methods.reset(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4" /> New Template
        </Button>
      </div>
      <DataTable data={data?.data || []} columns={columns} isLoading={isLoading} />

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title={editingTemplate ? 'Edit Template' : 'New Template'}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField name="name" label="Template Name"><Input placeholder="Welcome Email, Password Reset, etc." /></FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField name="subject" label="Subject / Title"><Input placeholder="Notification subject" /></FormField>
              <FormField name="channel" label="Channel">
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...methods.register('channel')}>
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="PUSH">Push</option>
                </select>
              </FormField>
            </div>
            <FormField name="body" label="Body Content" description={PLACEHOLDER_HINT}>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Write your template content with {{placeholder}} variables..."
                {...methods.register('body')}
              />
            </FormField>
            <FormField name="placeholders" label="Expected Placeholders (comma-separated)">
              <Input placeholder="user_name, booking_id, amount" />
            </FormField>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingTemplate ? 'Save Changes' : 'Create Template'}</Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}

export default TemplateEditor;
