import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole, Permission, Resource, Action } from '@/types/auth';

// Permission types
export type PermissionCheck = {
  resource: Resource;
  action: Action;
  conditions?: Record<string, any>;
};

// Role-based permissions configuration
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'users:read',
    'users:write',
    'users:delete',
    'providers:read',
    'providers:write',
    'providers:delete',
    'analytics:read',
    'analytics:write',
    'support:read',
    'support:write',
    'verification:read',
    'verification:write',
    'finance:read',
    'finance:write',
    'reviews:read',
    'reviews:write',
    'dashboard:read',
    'dashboard:write',
    'settings:read',
    'settings:write',
  ],
  ADMIN: [
    'users:read',
    'users:write',
    'providers:read',
    'providers:write',
    'analytics:read',
    'support:read',
    'support:write',
    'verification:read',
    'verification:write',
    'finance:read',
    'reviews:read',
    'dashboard:read',
  ],
  MODERATOR: [
    'users:read',
    'providers:read',
    'support:read',
    'support:write',
    'verification:read',
    'reviews:read',
    'reviews:write',
    'dashboard:read',
  ],
  ANALYST: [
    'users:read',
    'providers:read',
    'analytics:read',
    'dashboard:read',
  ],
  SUPPORT_AGENT: [
    'users:read',
    'providers:read',
    'support:read',
    'support:write',
    'dashboard:read',
  ],
};

// Resource to page mapping
const RESOURCE_PAGE_MAP: Record<Resource, string> = {
  USERS: '/admin/users',
  PROVIDERS: '/admin/providers',
  ANALYTICS: '/admin/analytics',
  SUPPORT: '/admin/support',
  VERIFICATION: '/admin/verification',
  FINANCE: '/admin/finance',
  REVIEWS: '/admin/reviews',
  DASHBOARD: '/admin/dashboard',
  SETTINGS: '/admin/settings',
};

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions: PermissionCheck | PermissionCheck[];
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermissions,
  fallback,
  requireAuth = true,
  redirectTo = '/auth/login',
}) => {
  const { user, isLoading, hasPermission } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Check if authentication is required
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // If no auth required and no user, allow access
    if (!requireAuth && !user) {
      setIsAuthorized(true);
      return;
    }

    // Check permissions
    const permissionChecks = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];

    const hasAllPermissions = permissionChecks.every(check => {
      if (!user) return false;
      
      // Check if user has the required permission
      const userPermissions = ROLE_PERMISSIONS[user.role] || [];
      const hasBasePermission = userPermissions.includes(check.resource as Permission);
      
      if (!hasBasePermission) return false;

      // Check additional conditions if provided
      if (check.conditions) {
        for (const [key, value] of Object.entries(check.conditions)) {
          if (user[key] !== value) return false;
        }
      }

      return true;
    });

    setIsAuthorized(hasAllPermissions);

    // Redirect if not authorized
    if (!hasAllPermissions && user) {
      // Find the closest accessible page
      const accessiblePages = Object.values(RESOURCE_PAGE_MAP).filter(page => 
        permissionChecks.some(check => 
          RESOURCE_PAGE_MAP[check.resource] === page || 
          hasPermission(`${check.resource}:read`)
        )
      );

      if (accessiblePages.length > 0) {
        router.push(accessiblePages[0]);
      } else {
        router.push('/admin/unauthorized');
      }
    }
  }, [user, isLoading, requiredPermissions, router, hasPermission, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access this resource.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Higher-order component for route protection
export const withPermissionGuard = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: PermissionCheck | PermissionCheck[],
  options?: {
    fallback?: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
  }
) => {
  return (props: P) => (
    <PermissionGuard
      requiredPermissions={requiredPermissions}
      fallback={options?.fallback}
      requireAuth={options?.requireAuth ?? true}
      redirectTo={options?.redirectTo}
    >
      <Component {...props} />
    </PermissionGuard>
  );
};

// Hook for checking permissions
export const usePermissions = () => {
  const { user, hasPermission } = useAuth();

  const can = (resource: Resource, action: Action, conditions?: Record<string, any>) => {
    if (!user) return false;

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    const permission = `${resource}:${action}` as Permission;
    
    const hasBasePermission = userPermissions.includes(permission);
    
    if (!hasBasePermission) return false;

    // Check additional conditions
    if (conditions) {
      for (const [key, value] of Object.entries(conditions)) {
        if (user[key] !== value) return false;
      }
    }

    return true;
  };

  const requireRole = (requiredRole: UserRole) => {
    return user?.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles: UserRole[]) => {
    return user ? requiredRoles.includes(user.role) : false;
  };

  const hasAllRoles = (requiredRoles: UserRole[]) => {
    return user ? requiredRoles.every(role => role === user.role) : false;
  };

  return {
    can,
    requireRole,
    hasAnyRole,
    hasAllRoles,
    user,
    hasPermission,
  };
};

// Admin role-based components
export const SuperAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { requireRole } = usePermissions();
  
  if (!requireRole('SUPER_ADMIN')) {
    return null;
  }
  
  return <>{children}</>;
};

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasAnyRole } = usePermissions();
  
  if (!hasAnyRole(['SUPER_ADMIN', 'ADMIN'])) {
    return null;
  }
  
  return <>{children}</>;
};

export const ModeratorGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasAnyRole } = usePermissions();
  
  if (!hasAnyRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR'])) {
    return null;
  }
  
  return <>{children}</>;
};

export const AnalystGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasAnyRole } = usePermissions();
  
  if (!hasAnyRole(['SUPER_ADMIN', 'ADMIN', 'ANALYST'])) {
    return null;
  }
  
  return <>{children}</>;
};

// Permission-aware button component
interface PermissionButtonProps {
  children: React.ReactNode;
  permission: PermissionCheck;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  children,
  permission,
  onClick,
  disabled = false,
  className,
  fallback,
}) => {
  const { can } = usePermissions();

  if (!can(permission.resource, permission.action, permission.conditions)) {
    return fallback || null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

// Permission-aware menu item component
interface PermissionMenuItemProps {
  children: React.ReactNode;
  permission: PermissionCheck;
  href?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const PermissionMenuItem: React.FC<PermissionMenuItemProps> = ({
  children,
  permission,
  href,
  icon,
  className,
}) => {
  const { can } = usePermissions();

  if (!can(permission.resource, permission.action, permission.conditions)) {
    return null;
  }

  return (
    <a
      href={href}
      className={className}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </a>
  );
};