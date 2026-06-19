// Authentication and Permission Types

// User Role Types
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'ANALYST' | 'SUPPORT_AGENT';

// Permission Types
export type Permission = 
  // User Management
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'users:manage'
  
  // Provider Management
  | 'providers:read'
  | 'providers:write'
  | 'providers:delete'
  | 'providers:manage'
  | 'providers:verify'
  
  // Analytics
  | 'analytics:read'
  | 'analytics:write'
  | 'analytics:export'
  | 'analytics:manage'
  
  // Support
  | 'support:read'
  | 'support:write'
  | 'support:delete'
  | 'support:manage'
  | 'support:escalate'
  
  // Verification
  | 'verification:read'
  | 'verification:write'
  | 'verification:approve'
  | 'verification:reject'
  | 'verification:manage'
  
  // Finance
  | 'finance:read'
  | 'finance:write'
  | 'finance:delete'
  | 'finance:manage'
  | 'finance:payout'
  | 'finance:refund'
  
  // Reviews
  | 'reviews:read'
  | 'reviews:write'
  | 'reviews:delete'
  | 'reviews:moderate'
  | 'reviews:manage'
  
  // Dashboard
  | 'dashboard:read'
  | 'dashboard:write'
  | 'dashboard:manage'
  
  // Settings
  | 'settings:read'
  | 'settings:write'
  | 'settings:manage';

// Resource Types
export type Resource = 
  | 'USERS'
  | 'PROVIDERS'
  | 'ANALYTICS'
  | 'SUPPORT'
  | 'VERIFICATION'
  | 'FINANCE'
  | 'REVIEWS'
  | 'DASHBOARD'
  | 'SETTINGS';

// Action Types
export type Action = 
  | 'read'
  | 'write'
  | 'delete'
  | 'manage'
  | 'approve'
  | 'reject'
  | 'verify'
  | 'moderate'
  | 'escalate'
  | 'payout'
  | 'refund'
  | 'export';

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  // Additional optional fields
  department?: string;
  title?: string;
  phone?: string;
  lastLoginIp?: string;
  loginCount?: number;
}

// Login Request Interface
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Login Response Interface
export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
  refreshToken?: string;
}

// Refresh Token Request Interface
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Refresh Token Response Interface
export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
  refreshToken?: string;
}

// Permission Check Interface
export interface PermissionCheck {
  resource: Resource;
  action: Action;
  conditions?: Record<string, any>;
}

// Role-based Permission Configuration
export interface RolePermissions {
  [key: string]: Permission[];
}

// Admin Route Configuration
export interface AdminRoute {
  path: string;
  component: string;
  requiredPermissions: PermissionCheck[];
  requireAuth?: boolean;
  roles?: UserRole[];
}

// Auth Context State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Action Types
export type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

// Permission Hook Return Type
export interface PermissionHookReturn {
  can: (resource: Resource, action: Action, conditions?: Record<string, any>) => boolean;
  requireRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
  user: User | null;
  hasPermission: (permission: string) => boolean;
}

// Admin Auth Hook Return Type
export interface AdminAuthHookReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  // Role checks
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isAnalyst: boolean;
  isSupportAgent: boolean;
  // Permission checks
  canManageUsers: boolean;
  canManageProviders: boolean;
  canViewAnalytics: boolean;
  canManageSupport: boolean;
  canManageVerification: boolean;
  canManageFinance: boolean;
  canManageReviews: boolean;
  canAccessDashboard: boolean;
  canManageSettings: boolean;
}

// RBAC Configuration
export interface RBACConfig {
  roles: Record<UserRole, {
    name: string;
    description: string;
    permissions: Permission[];
  }>;
  permissions: Record<Permission, {
    name: string;
    description: string;
    resource: Resource;
    action: Action;
  }>;
}

// Default RBAC Configuration
export const DEFAULT_RBAC_CONFIG: RBACConfig = {
  roles: {
    SUPER_ADMIN: {
      name: 'Super Admin',
      description: 'Full system access',
      permissions: [
        'users:read', 'users:write', 'users:delete', 'users:manage',
        'providers:read', 'providers:write', 'providers:delete', 'providers:manage', 'providers:verify',
        'analytics:read', 'analytics:write', 'analytics:export', 'analytics:manage',
        'support:read', 'support:write', 'support:delete', 'support:manage', 'support:escalate',
        'verification:read', 'verification:write', 'verification:approve', 'verification:reject', 'verification:manage',
        'finance:read', 'finance:write', 'finance:delete', 'finance:manage', 'finance:payout', 'finance:refund',
        'reviews:read', 'reviews:write', 'reviews:delete', 'reviews:moderate', 'reviews:manage',
        'dashboard:read', 'dashboard:write', 'dashboard:manage',
        'settings:read', 'settings:write', 'settings:manage',
      ],
    },
    ADMIN: {
      name: 'Admin',
      description: 'Administrative access',
      permissions: [
        'users:read', 'users:write', 'users:manage',
        'providers:read', 'providers:write', 'providers:manage', 'providers:verify',
        'analytics:read', 'analytics:write', 'analytics:export',
        'support:read', 'support:write', 'support:manage', 'support:escalate',
        'verification:read', 'verification:write', 'verification:approve', 'verification:reject',
        'finance:read', 'finance:write', 'finance:payout',
        'reviews:read', 'reviews:write', 'reviews:moderate',
        'dashboard:read', 'dashboard:write',
        'settings:read', 'settings:write',
      ],
    },
    MODERATOR: {
      name: 'Moderator',
      description: 'Content and user moderation',
      permissions: [
        'users:read',
        'providers:read',
        'support:read', 'support:write', 'support:escalate',
        'verification:read', 'verification:write', 'verification:approve', 'verification:reject',
        'reviews:read', 'reviews:write', 'reviews:moderate',
        'dashboard:read',
      ],
    },
    ANALYST: {
      name: 'Analyst',
      description: 'Analytics and reporting',
      permissions: [
        'users:read',
        'providers:read',
        'analytics:read', 'analytics:write', 'analytics:export',
        'dashboard:read',
      ],
    },
    SUPPORT_AGENT: {
      name: 'Support Agent',
      description: 'Customer support',
      permissions: [
        'users:read',
        'providers:read',
        'support:read', 'support:write', 'support:escalate',
        'dashboard:read',
      ],
    },
  },
  permissions: {
    'users:read': { name: 'Read Users', description: 'View user information', resource: 'USERS', action: 'read' },
    'users:write': { name: 'Write Users', description: 'Edit user information', resource: 'USERS', action: 'write' },
    'users:delete': { name: 'Delete Users', description: 'Delete user accounts', resource: 'USERS', action: 'delete' },
    'users:manage': { name: 'Manage Users', description: 'Full user management', resource: 'USERS', action: 'manage' },
    
    'providers:read': { name: 'Read Providers', description: 'View provider information', resource: 'PROVIDERS', action: 'read' },
    'providers:write': { name: 'Write Providers', description: 'Edit provider information', resource: 'PROVIDERS', action: 'write' },
    'providers:delete': { name: 'Delete Providers', description: 'Delete provider accounts', resource: 'PROVIDERS', action: 'delete' },
    'providers:manage': { name: 'Manage Providers', description: 'Full provider management', resource: 'PROVIDERS', action: 'manage' },
    'providers:verify': { name: 'Verify Providers', description: 'Verify provider accounts', resource: 'PROVIDERS', action: 'verify' },
    
    'analytics:read': { name: 'Read Analytics', description: 'View analytics data', resource: 'ANALYTICS', action: 'read' },
    'analytics:write': { name: 'Write Analytics', description: 'Create analytics reports', resource: 'ANALYTICS', action: 'write' },
    'analytics:export': { name: 'Export Analytics', description: 'Export analytics data', resource: 'ANALYTICS', action: 'export' },
    'analytics:manage': { name: 'Manage Analytics', description: 'Full analytics management', resource: 'ANALYTICS', action: 'manage' },
    
    'support:read': { name: 'Read Support', description: 'View support tickets', resource: 'SUPPORT', action: 'read' },
    'support:write': { name: 'Write Support', description: 'Create support responses', resource: 'SUPPORT', action: 'write' },
    'support:delete': { name: 'Delete Support', description: 'Delete support tickets', resource: 'SUPPORT', action: 'delete' },
    'support:manage': { name: 'Manage Support', description: 'Full support management', resource: 'SUPPORT', action: 'manage' },
    'support:escalate': { name: 'Escalate Support', description: 'Escalate support tickets', resource: 'SUPPORT', action: 'escalate' },
    
    'verification:read': { name: 'Read Verification', description: 'View verification requests', resource: 'VERIFICATION', action: 'read' },
    'verification:write': { name: 'Write Verification', description: 'Update verification status', resource: 'VERIFICATION', action: 'write' },
    'verification:approve': { name: 'Approve Verification', description: 'Approve verification requests', resource: 'VERIFICATION', action: 'approve' },
    'verification:reject': { name: 'Reject Verification', description: 'Reject verification requests', resource: 'VERIFICATION', action: 'reject' },
    'verification:manage': { name: 'Manage Verification', description: 'Full verification management', resource: 'VERIFICATION', action: 'manage' },
    
    'finance:read': { name: 'Read Finance', description: 'View financial data', resource: 'FINANCE', action: 'read' },
    'finance:write': { name: 'Write Finance', description: 'Edit financial records', resource: 'FINANCE', action: 'write' },
    'finance:delete': { name: 'Delete Finance', description: 'Delete financial records', resource: 'FINANCE', action: 'delete' },
    'finance:manage': { name: 'Manage Finance', description: 'Full financial management', resource: 'FINANCE', action: 'manage' },
    'finance:payout': { name: 'Process Payouts', description: 'Process provider payouts', resource: 'FINANCE', action: 'payout' },
    'finance:refund': { name: 'Process Refunds', description: 'Process customer refunds', resource: 'FINANCE', action: 'refund' },
    
    'reviews:read': { name: 'Read Reviews', description: 'View user reviews', resource: 'REVIEWS', action: 'read' },
    'reviews:write': { name: 'Write Reviews', description: 'Moderate reviews', resource: 'REVIEWS', action: 'write' },
    'reviews:delete': { name: 'Delete Reviews', description: 'Delete reviews', resource: 'REVIEWS', action: 'delete' },
    'reviews:moderate': { name: 'Moderate Reviews', description: 'Review content moderation', resource: 'REVIEWS', action: 'moderate' },
    'reviews:manage': { name: 'Manage Reviews', description: 'Full review management', resource: 'REVIEWS', action: 'manage' },
    
    'dashboard:read': { name: 'Read Dashboard', description: 'View dashboard', resource: 'DASHBOARD', action: 'read' },
    'dashboard:write': { name: 'Write Dashboard', description: 'Edit dashboard', resource: 'DASHBOARD', action: 'write' },
    'dashboard:manage': { name: 'Manage Dashboard', description: 'Full dashboard management', resource: 'DASHBOARD', action: 'manage' },
    
    'settings:read': { name: 'Read Settings', description: 'View system settings', resource: 'SETTINGS', action: 'read' },
    'settings:write': { name: 'Write Settings', description: 'Edit system settings', resource: 'SETTINGS', action: 'write' },
    'settings:manage': { name: 'Manage Settings', description: 'Full settings management', resource: 'SETTINGS', action: 'manage' },
  },
};