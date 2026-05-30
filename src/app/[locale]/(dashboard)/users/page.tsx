'use client';

import * as React from 'react';
import { UserList } from '@/features/users/components/UserList';
import { Card, CardContent } from '@/components/ui/card';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage customers, providers, and administration staff.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <UserList />
        </CardContent>
      </Card>
    </div>
  );
}
