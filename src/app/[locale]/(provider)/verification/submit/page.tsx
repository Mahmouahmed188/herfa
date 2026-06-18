'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { VerificationSubmissionForm } from '@/features/providers/components/VerificationSubmissionForm';
import { useVerificationStatus } from '@/features/providers/hooks/useVerification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerificationSubmitPage() {
  const t = useTranslations('Verification');
  const { data: statusData, isLoading: statusLoading } = useVerificationStatus();

  if (statusLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const hasPendingOrActive =
    statusData?.success && ['PENDING', 'UNDER_REVIEW', 'APPROVED'].includes(statusData.data?.status);

  if (hasPendingOrActive) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('submitTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You already have a {statusData.data?.status.toLowerCase().replace('_', ' ')} verification application.
            </p>
            <Button asChild>
              <Link href="/provider/verification">{t('statusTitle')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/provider/verification">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('title')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('submitTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <VerificationSubmissionForm existingStatus={statusData?.success ? statusData.data : undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
