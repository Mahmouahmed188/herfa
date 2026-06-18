'use client';

import * as React from 'react';
import { Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useBroadcasts } from '@/features/notifications/hooks/useNotifications';
import { AnnouncementCard } from '@/features/notifications/components/AnnouncementCard';

export default function AnnouncementsPage() {
  const [page, setPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'SENT' | 'SCHEDULED' | 'DRAFT'>('all');
  const { data, isLoading } = useBroadcasts({ page, limit: 20 });

  const announcements = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const filtered = statusFilter === 'all'
    ? announcements
    : announcements.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3">
        <Megaphone className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Announcements</h1>
      </div>

      <div className="flex gap-2">
        {(['all', 'SENT', 'SCHEDULED', 'DRAFT'] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setStatusFilter(f); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              statusFilter === f
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-surface-border text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-12 text-slate-500 dark:text-gray-400">
          <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-semibold">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Link key={a.id} href={`/announcements/${a.id}`}>
              <AnnouncementCard
                id={a.id}
                title={a.title}
                body={a.message}
                status={a.status}
                createdAt={a.createdAt}
              />
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-surface-border text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500 dark:text-gray-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-surface-border text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}