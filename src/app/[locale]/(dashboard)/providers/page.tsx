'use client';

import * as React from 'react';
import { ProviderList } from '@/features/providers/components/ProviderList';
import { Card, CardContent } from '@/components/ui/card';

export default function ProvidersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Provider Management</h1>
        <p className="text-muted-foreground">Monitor service providers, review documents, and manage performance.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ProviderList />
        </CardContent>
      </Card>
    </div>
  );
}
