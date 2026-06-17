'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { UserRole } from '@/types/api';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/login');
      return;
    }

    if (user?.role === 'PROVIDER' && user?.status !== 'ACTIVE') {
        const isPublicOnboarding = pathname.includes('/technician/onboarding-home');
        if (!isPublicOnboarding) {
            router.push('/technician/onboarding-home');
        }
    }
  }, [isAuthenticated, user, router, pathname, allowedRoles]);

  return <>{children}</>;
}
