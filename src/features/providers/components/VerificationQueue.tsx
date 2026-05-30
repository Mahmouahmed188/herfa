'use client';

import * as React from 'react';
import { useVerificationQueue } from '../hooks/useVerification';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { ProviderVerification } from '../schemas/verification';
import { format } from 'date-fns';
import { SearchFilter } from '@/components/ui/filters/SearchFilter';
import { useSearchParams } from 'next/navigation';

export function VerificationQueue() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query') || '';

  const { data, isLoading } = useVerificationQueue({ page, query });

  const columns = [
    {
      header: 'Provider Name',
      accessorKey: 'providerName',
    },
    {
      header: 'Submitted At',
      accessorKey: 'submittedAt',
      cell: (row: ProviderVerification) => format(new Date(row.submittedAt), 'PPP'),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: ProviderVerification) => (
        <Badge
          variant={
            row.status === 'APPROVED'
              ? 'default'
              : row.status === 'REJECTED'
              ? 'destructive'
              : 'secondary'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: ProviderVerification) => (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/providers/verification/${row.id}`}>
            Review
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Verification Queue</h2>
      </div>
      
      <SearchFilter />

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
                onPageChange: (p) => {
                  // In a real app, this would update the URL
                },
              }
            : undefined
        }
      />
    </div>
  );
}
