'use client';

import { AppSidebar } from '@/components/layout/AppSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSidebar } from '@/context/SidebarContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <ProtectedRoute>
      <div className="flex flex-1 min-h-screen">
        <AppSidebar role="admin" />
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
    </ProtectedRoute>
  );
}
