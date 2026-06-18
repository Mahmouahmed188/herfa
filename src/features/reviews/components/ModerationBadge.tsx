'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Review, deriveModerationState } from '../types';

interface ModerationBadgeProps {
  review: Pick<Review, 'isApproved' | 'isFlagged'>;
  className?: string;
}

const stateStyles: Record<string, string> = {
  APPROVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  FLAGGED: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  REJECTED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

export function ModerationBadge({ review, className }: ModerationBadgeProps) {
  const t = useTranslations('Reviews.moderation');
  const state = deriveModerationState(review.isApproved, review.isFlagged);
  const stateKey = state.toLowerCase() as keyof typeof stateStyles;

  const style = stateStyles[state] || stateStyles.PENDING;
  const label = t(stateKey) || state;

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', style, className)}>
      {label}
    </span>
  );
}
