'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

import { usePathname } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Technician status protection
    if (user?.role === 'technician' && user?.status !== 'approved') {
        const isPublicOnboarding = pathname.includes('/technician/onboarding-home');
        if (!isPublicOnboarding) {
            router.push('/technician/onboarding-home');
        }
    }
  }, [isAuthenticated, user, router, pathname]);

  return <>{children}</>;
}
