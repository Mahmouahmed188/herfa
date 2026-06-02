'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { NavigationItem } from '@/features/header/types';

interface HeaderMobileNavProps {
  items: NavigationItem[];
  isActive: (href: string) => boolean;
}

export function HeaderMobileNav({ items, isActive }: HeaderMobileNavProps) {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [mobileMenuOpen, handleKeyDown]);

  return (
    <>
      <button
        className="md:hidden p-2 text-white bg-surface-dark rounded-xl focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-border bg-background-dark overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href as any}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "p-4 rounded-xl text-lg font-bold transition-all focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-400 hover:text-white hover:bg-surface-dark"
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
