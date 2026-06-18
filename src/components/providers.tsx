'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/react-query';
import { SidebarProvider } from '@/context/SidebarContext';
import { useInitializeAuth } from '@/features/auth/hooks/useInitializeAuth';
import { useTokenExpiry } from '@/features/auth/hooks/useTokenExpiry';
import { useNotificationSocket } from '@/features/notifications/hooks/useCustomerNotifications';
import '@/i18n/i18n';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useInitializeAuth();
  useTokenExpiry();
  useNotificationSocket();
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <SidebarProvider>
          <AuthInitializer>{children}</AuthInitializer>
          <Toaster position="top-right" richColors closeButton />
        </SidebarProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
