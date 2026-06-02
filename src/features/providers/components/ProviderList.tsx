'use client';

import * as React from 'react';
import { useProviders } from '../hooks/useVerification';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { format } from 'date-fns';
import { SearchFilter } from '@/components/ui/filters/SearchFilter';
import { useSearchParams } from 'next/navigation';
import { Star } from 'lucide-react';

export function ProviderList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query') || '';
  const status = searchParams.get('status') || undefined;

  const { data, isLoading } = useProviders({ page, query, status });

  const columns = [
    {
      header: 'Provider',
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.category}</span>
        </div>
      ),
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{row.rating}</span>
          <span className="text-xs text-muted-foreground">({row.reviewCount})</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <Badge
          variant={
            row.status === 'VERIFIED'
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
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: any) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/providers/${row.id}` as any}>
            View Details
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Service Providers</h2>
        <Button asChild>
          <Link href="/admin/providers/verification">
            Verification Queue
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <SearchFilter />
        {/* Status filters could go here */}
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
