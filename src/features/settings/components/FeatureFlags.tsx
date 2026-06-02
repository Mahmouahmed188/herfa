'use client';

import * as React from 'react';
import { useFeatureFlags, useToggleFeatureFlag } from '../hooks/useSettings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/common/Loading';

export function FeatureFlagManager() {
  const { data, isLoading } = useFeatureFlags();
  const toggleMutation = useToggleFeatureFlag();

  if (isLoading) return <Loading fullPage />;

  const flags = data?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {flags.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No feature flags configured.</p>
        ) : (
          flags.map((flag) => (
            <div key={flag.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{flag.label}</span>
                  <Badge variant={flag.enabled ? 'default' : 'secondary'} className="text-[10px]">
                    {flag.enabled ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{flag.description}</p>
                {flag.enabledForRoles?.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {flag.enabledForRoles.map((role) => (
                      <Badge key={role} variant="outline" className="text-[10px]">{role}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={flag.enabled}
                onClick={() => toggleMutation.mutate({ id: flag.id, enabled: !flag.enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  flag.enabled ? 'bg-primary' : 'bg-input'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    flag.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
