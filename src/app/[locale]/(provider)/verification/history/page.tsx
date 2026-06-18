'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { VerificationHistory } from '@/features/providers/components/VerificationHistory';
import { useVerificationHistory } from '@/features/providers/hooks/useVerification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerificationHistoryPage() {
  const t = useTranslations('Verification');
  const { data, isLoading, isError } = useVerificationHistory();

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
          <CardTitle>{t('historyTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <VerificationHistory
            events={data?.success ? data.data : []}
            isLoading={isLoading}
            isError={isError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
