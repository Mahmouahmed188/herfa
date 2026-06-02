'use client';

import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { NavigationItem } from '@/features/header/types';

interface HeaderNavProps {
  items: NavigationItem[];
  isActive: (href: string) => boolean;
}

export function HeaderNav({ items, isActive }: HeaderNavProps) {
  const t = useTranslations();

  return (
    <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1 bg-surface-dark/50 p-1 rounded-2xl border border-surface-border">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href as any}
          className={cn(
            "relative px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl overflow-hidden group focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
            isActive(item.href)
              ? "text-primary"
              : "text-gray-400 hover:text-white"
          )}
        >
          {isActive(item.href) && (
            <motion.div
              layoutId="activeNav"
              className="absolute inset-0 bg-primary/10 z-0"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{t(item.labelKey)}</span>
        </Link>
      ))}
    </nav>
  );
}
