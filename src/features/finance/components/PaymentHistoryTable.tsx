'use client';

import * as React from 'react';
import { usePayments, useProviderPayments } from '../hooks/usePayments';
import { DataTable } from '@/components/ui/data-table';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { Payment } from '../types';
import { format } from 'date-fns';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PaymentHistoryTableProps {
  type: 'customer' | 'provider';
}

export function PaymentHistoryTable({ type }: PaymentHistoryTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Finance');
  
  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || undefined;
  
  const customerPayments = usePayments({ page, status: status === 'ALL' ? undefined : status });
  const providerPayments = useProviderPayments({ page, status: status === 'ALL' ? undefined : status });
  
  const { data, isLoading } = type === 'customer' ? customerPayments : providerPayments;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const columns = [
    {
      header: t('transactionId'),
      accessorKey: 'id',
      cell: (row: Payment) => <span className="font-mono text-xs">{row.id.slice(0, 8)}...</span>,
    },
    {
      header: t('bookingId'),
      accessorKey: 'bookingId',
      cell: (row: Payment) => <span className="font-mono text-xs">{row.bookingId.slice(0, 8)}...</span>,
    },
    {
      header: t('amount'),
      accessorKey: 'amount',
      cell: (row: Payment) => (
        <span className="font-semibold">
          {row.amount} {row.currency}
        </span>
      ),
    },
    {
      header: t('date'),
      accessorKey: 'createdAt',
      cell: (row: Payment) => format(new Date(row.createdAt), 'PP'),
    },
    {
      header: t('status'),
      accessorKey: 'status',
      cell: (row: Payment) => <PaymentStatusBadge status={row.status} />,
    },
    {
      header: t('details'),
      accessorKey: 'id',
      cell: (row: Payment) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/${pathname.split('/')[1]}/finance/${row.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
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
                onPageChange: handlePageChange,
              }
            : undefined
        }
      />
    </div>
  );
}
