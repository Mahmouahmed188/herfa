'use client';

import * as React from 'react';
import { useAuditLogs } from '../hooks/useAudit';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { AuditLog } from '../services/api';
import { format } from 'date-fns';
import { SearchFilter } from '@/components/ui/filters/SearchFilter';
import { useSearchParams } from 'next/navigation';

export function AuditLogTable() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query') || '';
  const module = searchParams.get('module') || undefined;

  const { data, isLoading } = useAuditLogs({ page, query, module });

  const columns = [
    {
      header: 'Admin',
      accessorKey: 'adminName',
      cell: (row: AuditLog) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.adminName}</span>
          <span className="text-[10px] text-muted-foreground">{row.ipAddress}</span>
        </div>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: (row: AuditLog) => (
        <span className="text-sm">{row.action}</span>
      ),
    },
    {
      header: 'Module',
      accessorKey: 'module',
      cell: (row: AuditLog) => (
        <Badge variant="outline">{row.module}</Badge>
      ),
    },
    {
      header: 'Timestamp',
      accessorKey: 'createdAt',
      cell: (row: AuditLog) => format(new Date(row.createdAt), 'PPpp'),
    },
    {
      header: 'Details',
      accessorKey: 'details',
      cell: (row: AuditLog) => (
        <span className="text-xs text-muted-foreground truncate max-w-[200px] block" title={row.details}>
          {row.details}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SearchFilter />
        <div className="flex gap-2">
          {['ALL', 'AUTH', 'USERS', 'PROVIDERS', 'FINANCE', 'CMS'].map((m) => (
            <button
              key={m}
              className="text-xs px-2 py-1 rounded border hover:bg-muted"
              onClick={() => {}}
            >
              {m}
            </button>
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
