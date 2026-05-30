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

export function UserList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query') || '';
  const role = searchParams.get('role') || undefined;

  const { data, isLoading } = useUsers({ page, query, role });

  const columns = [
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
    </div>
  );
}
