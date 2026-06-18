'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { VerificationDashboard } from '@/features/providers/components/VerificationDashboard';
import { useVerificationStatus } from '@/features/providers/hooks/useVerification';

export default function VerificationPage() {
  const t = useTranslations('Verification');
  const { data, isLoading, isError, refetch } = useVerificationStatus();

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('statusTitle')}</p>
      </div>

      <VerificationDashboard
        data={data?.success ? data.data : null}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />
    </div>
  );
}
