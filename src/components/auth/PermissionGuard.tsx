'use client';
import * as React from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { AlertTriangle } from 'lucide-react';

interface PermissionGuardProps {
  permissions?: string[];
  roles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  roles = [],
  children,
  fallback,
}: PermissionGuardProps) {
  const { user } = useAuthStore();

  if (!user) {
    return fallback ?? null;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return fallback ?? (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view this content.</p>
      </div>
    );
  }

  return <>{children}</>;
}
