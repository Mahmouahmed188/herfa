'use client';

import * as React from 'react';
import { Megaphone, X } from 'lucide-react';
import { useBroadcasts } from '../hooks/useNotifications';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

const DISMISSED_KEY = 'herfa_dismissed_announcements';

function getDismissedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
  } catch {
    return [];
  }
}

function addDismissedId(id: string) {
  const ids = getDismissedIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
  }
}

function AnnouncementBannerInner() {
  const [dismissed, setDismissed] = React.useState<string[]>([]);
  const { data } = useBroadcasts({ limit: 5 });

  React.useEffect(() => {
    setDismissed(getDismissedIds());
  }, []);

  const rawData = data as
    | { data?: { id: string; title: string; body: string; status: string }[] }
    | undefined;
  const announcements = rawData?.data ?? [];

  const activeAnnouncements = announcements.filter(
    (a) => a.status === 'SENT' && !dismissed.includes(a.id)
  );

  if (activeAnnouncements.length === 0) return null;

  const banner = activeAnnouncements[0];

  return (
    <div className="bg-primary/5 border-b border-primary/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <Megaphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{banner.title}</p>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 line-clamp-2">
            {banner.body}
          </p>
        </div>
        <button
          onClick={() => {
            addDismissedId(banner.id);
            setDismissed((prev) => [...prev, banner.id]);
          }}
          className="shrink-0 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-border transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}

export function AnnouncementBanner() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return null;
  return <AnnouncementBannerInner />;
}
