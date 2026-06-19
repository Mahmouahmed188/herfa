'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Clock, Activity } from 'lucide-react';

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button>Export Logs</Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search activity logs..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          {['ALL', 'ADMIN', 'USER', 'PROVIDER', 'SYSTEM'].map((f) => (
            <Button key={f} variant={f === 'ALL' ? 'default' : 'outline'} size="sm">{f}</Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Activity logs will be displayed here with filtering capabilities.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
