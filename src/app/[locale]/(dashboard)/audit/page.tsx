'use client';

import * as React from 'react';
import { AuditLogTable } from '@/features/audit/components/AuditLogTable';
import { Card, CardContent } from '@/components/ui/card';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Track all administrative actions and security events across the platform.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <AuditLogTable />
        </CardContent>
      </Card>
    </div>
  );
}
