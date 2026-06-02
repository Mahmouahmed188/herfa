'use client';

import React from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { UserRole } from '@/types/api';

interface PermissionGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

/**
 * PermissionGuard provides fine-grained control over UI elements based on user roles and permissions.
 * It aligns with the "Zero-Trust & Permission-Based UI" principle of the constitution.
 */
export function PermissionGuard({
  children,
  allowedRoles,
  requiredPermissions,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuthStore();

  if (!user) return fallback as React.ReactElement;

  // Role-based check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return fallback as React.ReactElement;
  }

  // Permission-based check (placeholder for future fine-grained permissions)
  // In a real implementation, user.permissions would be an array of strings
  if (requiredPermissions && requiredPermissions.length > 0) {
    // const hasPermission = requiredPermissions.every(p => user.permissions?.includes(p));
    // if (!hasPermission) return fallback as React.ReactElement;
  }

  return <>{children}</>;
}
