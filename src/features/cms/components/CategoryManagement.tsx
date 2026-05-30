'use client';

import * as React from 'react';
import { useCategories, useCreateCategory, useUpdateCategory } from '../hooks/useCms';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Category } from '../services/api';
import { Dialog } from '@/components/ui/feedback/Dialog';
import { FormField } from '@/components/ui/forms/FormField';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categorySchema = z.object({
  nameAr: z.string().min(2, 'Arabic name is required'),
  nameEn: z.string().min(2, 'English name is required'),
  status: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']),
});

type CategoryInput = z.infer<typeof categorySchema>;

export function CategoryManagement() {
  const { data, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

  const methods = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nameAr: '',
      nameEn: '',
      status: 'DRAFT',
    },
  });

  const onSubmit = (values: CategoryInput) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, data: values },
        { onSuccess: () => setIsDialogOpen(false) }
      );
    } else {
      createMutation.mutate(values as any, {
        onSuccess: () => {
          setIsDialogOpen(false);
          methods.reset();
        },
      });
    }
  };

  const columns = [
    {
      header: 'Arabic Name',
      accessorKey: 'nameAr',
    },
    {
      header: 'English Name',
      accessorKey: 'nameEn',
    },
    {
      header: 'Services',
      accessorKey: 'serviceCount',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: Category) => (
        <Badge variant={row.status === 'PUBLISHED' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: Category) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditingCategory(row);
              methods.reset({
                nameAr: row.nameAr,
                nameEn: row.nameEn,
                status: row.status,
              });
              setIsDialogOpen(true);
            }}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Service Categories</h2>
        <Button 
          className="gap-2" 
          onClick={() => {
            setEditingCategory(null);
            methods.reset();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Category
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
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField name="nameAr" label="Name (Arabic)">
              <Input placeholder="سباكة..." />
            </FormField>
            <FormField name="nameEn" label="Name (English)">
              <Input placeholder="Plumbing..." />
            </FormField>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
