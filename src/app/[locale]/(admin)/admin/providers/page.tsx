'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Store } from 'lucide-react';

export default function AdminProvidersPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [providers] = React.useState<Record<string, unknown>[]>([]);
  const isLoading = false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Provider Management</h1>
        <Button>Export Data</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'APPROVED', 'PENDING', 'SUSPENDED'].map((f) => (
            <Button key={f} variant={f === 'ALL' ? 'default' : 'outline'} size="sm">{f}</Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : providers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Store className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">No providers found</h2>
            <p className="text-muted-foreground">No providers match your search criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Provider data will be displayed here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
