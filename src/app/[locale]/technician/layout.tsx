'use client';

import { AppSidebar } from '@/components/layout/AppSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSidebar } from '@/context/SidebarContext';
import { Header } from '@/components/layout/Header';

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    // EMERGENCY FIX: Bypass authentication checks
    <ProtectedRoute allowedRoles={['PROVIDER']} requireAuth={false}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <AppSidebar role="PROVIDER" />
          <main
            className="flex-1 p-8 transition-all duration-300 ease-in-out"
            style={{
              paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 768
                ? (isCollapsed ? '150px' : '360px')
                : '0px'
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
