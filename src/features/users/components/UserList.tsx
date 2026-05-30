'use client';

import * as React from 'react';
import { useUsers } from '../hooks/useUsers';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { User } from '@/types/api';
import { format } from 'date-fns';
import { SearchFilter } from '@/components/ui/filters/SearchFilter';
import { useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/feedback/Dialog';
import { Download, ShieldAlert, ShieldCheck, CheckSquare } from 'lucide-react';

export function UserList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query') || '';
  const role = searchParams.get('role') || undefined;

  const { data, isLoading } = useUsers({ page, query, role });

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = React.useState(false);
  const [bulkStatus, setBulkStatus] = React.useState<'ACTIVE' | 'SUSPENDED'>('SUSPENDED');
  const updateStatus = useUpdateUserStatus();

  const handleSelectAll = () => {
    if (selectedIds.length === (data?.data?.length || 0)) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data?.data?.map(u => u.id) || []);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = () => {
    selectedIds.forEach(id => {
      updateStatus.mutate({ id, status: bulkStatus, reason: 'Bulk action from admin panel' });
    });
    setIsBulkDialogOpen(false);
    setSelectedIds([]);
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedIds.length === data?.data?.length && data?.data?.length > 0}
          onChange={handleSelectAll}
          className="h-4 w-4 rounded border-input accent-primary"
        />
      ),
      accessorKey: 'id',
      cell: (row: User) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => handleSelect(row.id)}
          className="h-4 w-4 rounded border-input accent-primary"
        />
      ),
    },
    {
      header: 'User',
      accessorKey: 'email',
      cell: (row: User) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">
            {row.firstName} {row.lastName}
          </span>
          <span className="text-xs text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (row: User) => (
        <Badge variant="outline" className="capitalize">
          {row.role.toLowerCase().replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: User) => (
        <Badge
          variant={
            row.status === 'ACTIVE'
              ? 'default'
              : row.status === 'SUSPENDED'
              ? 'destructive'
              : 'secondary'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Joined',
      accessorKey: 'createdAt',
      cell: (row: User) => format(new Date(row.createdAt), 'PP'),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: User) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/users/${row.id}`}>
            View Details
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Platform Users</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <SearchFilter />
        <div className="flex gap-2">
          {['ALL', 'CLIENT', 'ADMIN', 'SUPPORT'].map((r) => (
            <Button
              key={r}
              variant={role === r || (!role && r === 'ALL') ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                // Update URL role param
              }}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
          <CheckSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{selectedIds.length} selected</span>
          <div className="flex gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => {
                setBulkStatus('SUSPENDED');
                setIsBulkDialogOpen(true);
              }}
            >
              <ShieldAlert className="w-4 h-4" />
              Suspend Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => {
                setBulkStatus('ACTIVE');
                setIsBulkDialogOpen(true);
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              Activate Selected
            </Button>
            <Button size="sm" variant="ghost" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>
      )}

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        pagination={
          data?.meta
            ? {
                total: data.meta.total,
                page: data.meta.page,
                limit: data.meta.limit,
                onPageChange: (p) => {},
              }
            : undefined
        }
      />

      <Dialog
        isOpen={isBulkDialogOpen}
        onClose={() => setIsBulkDialogOpen(false)}
        title={bulkStatus === 'SUSPENDED' ? 'Bulk Suspend Users' : 'Bulk Activate Users'}
        description={`This will ${bulkStatus === 'SUSPENDED' ? 'suspend' : 'activate'} ${selectedIds.length} user(s).`}
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={() => setIsBulkDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={bulkStatus === 'SUSPENDED' ? 'destructive' : 'default'}
            onClick={handleBulkAction}
            disabled={updateStatus.isPending}
          >
            Confirm {bulkStatus === 'SUSPENDED' ? 'Suspension' : 'Activation'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
