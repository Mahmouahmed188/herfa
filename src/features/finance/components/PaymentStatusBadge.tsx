import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '../types';
import { cn } from '@/lib/utils';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig: Record<PaymentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  AUTHORIZED: { label: 'Authorized', variant: 'secondary' },
  PAID: { label: 'Paid', variant: 'default' },
  REFUNDED: { label: 'Refunded', variant: 'outline' },
  PARTIALLY_REFUNDED: { label: 'Partially Refunded', variant: 'outline' },
  FAILED: { label: 'Failed', variant: 'destructive' },
  CANCELLED: { label: 'Cancelled', variant: 'outline' },
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'outline' };

  return (
    <Badge variant={config.variant} className={cn('capitalize', className)}>
      {config.label}
    </Badge>
  );
}
