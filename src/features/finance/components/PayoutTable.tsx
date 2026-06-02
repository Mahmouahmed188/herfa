'use client';

import * as React from 'react';
import { usePayoutRequests, useProcessPayouts } from '../hooks/usePayouts';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PayoutRequest } from '../schemas/payouts';
import { format } from 'date-fns';
import { SearchFilter } from '@/components/ui/filters/SearchFilter';
import { useSearchParams } from 'next/navigation';
import { Check, X, CreditCard } from 'lucide-react';

export function PayoutTable() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || undefined;
  
  const { data, isLoading } = usePayoutRequests({ page, status: status });
  const processMutation = useProcessPayouts();

  const handleProcess = (id: string, action: 'APPROVE' | 'REJECT') => {
    processMutation.mutate({ payoutIds: [id], action });
  };

  const columns = [
    {
      header: 'Provider',
      accessorKey: 'providerName',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (row: PayoutRequest) => (
        <span className="font-semibold">
          {row.amount} {row.currency}
        </span>
      ),
    },
    {
      header: 'Requested At',
      accessorKey: 'requestedAt',
      cell: (row: PayoutRequest) => format(new Date(row.requestedAt), 'PP'),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: PayoutRequest) => (
        <Badge
          variant={
            row.status === 'COMPLETED'
              ? 'default'
              : row.status === 'FAILED'
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
      cell: (row: PayoutRequest) => (
        row.status === 'PENDING' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => handleProcess(row.id, 'REJECT')}
              disabled={processMutation.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-primary"
              onClick={() => handleProcess(row.id, 'APPROVE')}
              disabled={processMutation.isPending}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED'].map((s) => (
            <Button
              key={s}
              variant={status === s || (!status && s === 'ALL') ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                // Update URL status param
              }}
            >
              {s}
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
