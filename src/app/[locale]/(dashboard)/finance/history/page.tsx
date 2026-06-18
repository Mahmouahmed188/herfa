'use client';

import * as React from 'react';
import { PaymentHistoryTable } from '@/features/finance/components/PaymentHistoryTable';
import { PaymentFilterBar } from '@/features/finance/components/PaymentFilterBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function AdminPaymentHistoryPage() {
  const t = useTranslations('Finance');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('paymentHistory')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <PaymentFilterBar />

      <Card>
        <CardHeader>
          <CardTitle>{t('paymentHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentHistoryTable type="customer" />
        </CardContent>
      </Card>
    </div>
  );
}
