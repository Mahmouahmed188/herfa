'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useNavigation } from '@/features/header/hooks/useNavigation';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { HeaderMobileNav } from './HeaderMobileNav';
import { HeaderActions } from './HeaderActions';
import { HeaderLanguageSwitcher } from './HeaderLanguageSwitcher';
import { HeaderThemeToggle } from './HeaderThemeToggle';

export function Header() {
  const pathname = usePathname();
  const { items, isActive, isAuthenticated } = useNavigation(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background-dark/80 backdrop-blur-md min-h-[80px]">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <HeaderLogo />
        </div>
        <div>
          <HeaderNav items={items} isActive={isActive} />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <HeaderThemeToggle />
            <HeaderLanguageSwitcher />
            <HeaderActions />
          </div>
          <HeaderMobileNav items={items} isActive={isActive} />
        </div>
      </div>
    </header>
  );
}
