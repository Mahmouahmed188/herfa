'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const statuses = ['ALL', 'PENDING', 'PAID', 'REFUNDED', 'FAILED', 'CANCELLED'];

export function PaymentFilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Finance');
  
  const currentStatus = searchParams.get('status') || 'ALL';

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {statuses.map((status) => (
        <Button
          key={status}
          variant={currentStatus === status ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusChange(status)}
          className="whitespace-nowrap"
        >
          {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
        </Button>
      ))}
    </div>
  );
}
