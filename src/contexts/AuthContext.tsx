'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

// User types
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'ANALYST' | 'SUPPORT_AGENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  avatar?: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

// Auth context types
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user profile
        const response = await api.get('/admin/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('admin_token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      
      const { token, user: userData } = response.data;
      
      // Store token
      localStorage.setItem('admin_token', token);
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user
      setUser(userData);
      
      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    // Remove token
    localStorage.removeItem('admin_token');
    
    // Remove token from axios headers
    delete api.defaults.headers.common['Authorization'];
    
    // Clear user
    setUser(null);
    
    // Redirect to login
    router.push('/auth/login');
  };

  // Refresh user function
  const refreshUser = async (): Promise<void> => {
    try {
      const response = await api.get('/admin/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasPermission,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for checking if user has specific role
export const useRole = () => {
  const { user } = useAuth();
  
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };
  
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };
  
  const hasAllRoles = (roles: UserRole[]): boolean => {
    return user ? roles.every(role => role === user.role) : false;
  };
  
  return {
    userRole: user?.role,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
};

// Hook for admin-specific features
export const useAdminAuth = () => {
  const { user, hasPermission, isAuthenticated, isLoading } = useAuth();
  const { hasRole, hasAnyRole } = useRole();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    hasPermission,
    // Role checks
    isSuperAdmin: hasRole('SUPER_ADMIN'),
    isAdmin: hasAnyRole(['SUPER_ADMIN', 'ADMIN']),
    isModerator: hasAnyRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']),
    isAnalyst: hasAnyRole(['SUPER_ADMIN', 'ADMIN', 'ANALYST']),
    isSupportAgent: hasAnyRole(['SUPER_ADMIN', 'ADMIN', 'SUPPORT_AGENT']),
    // Permission checks
    canManageUsers: hasPermission('users:write'),
    canManageProviders: hasPermission('providers:write'),
    canViewAnalytics: hasPermission('analytics:read'),
    canManageSupport: hasPermission('support:write'),
    canManageVerification: hasPermission('verification:write'),
    canManageFinance: hasPermission('finance:write'),
    canManageReviews: hasPermission('reviews:write'),
    canAccessDashboard: hasPermission('dashboard:read'),
    canManageSettings: hasPermission('settings:write'),
  };
};