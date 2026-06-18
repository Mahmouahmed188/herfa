'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface VerificationStatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  SUSPENDED: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabelKeys: Record<string, string> = {
  pending: 'pending',
  under_review: 'underReview',
  approved: 'approved',
  rejected: 'rejected',
  suspended: 'suspended',
};

export function VerificationStatusBadge({ status, className }: VerificationStatusBadgeProps) {
  const t = useTranslations('Verification');
  const labelKey = statusLabelKeys[status.toLowerCase()] || status.toLowerCase();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200',
        className
      )}
    >
      {t(labelKey as any) || status}
    </span>
  );
}
