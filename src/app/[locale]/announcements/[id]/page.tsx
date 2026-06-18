'use client';

import * as React from 'react';
import { Megaphone, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useBroadcasts } from '@/features/notifications/hooks/useNotifications';

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useBroadcasts({ limit: 100 });

  const rawData = data as { data?: { id: string; title: string; body: string; status: string; createdAt: string }[] } | undefined;
  const announcement = rawData?.data?.find((a) => a.id === params.id);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="text-center p-12">
        <p className="text-slate-500 dark:text-gray-400">Announcement not found</p>
        <Link href="/announcements" className="text-primary text-sm font-semibold mt-2 inline-block hover:underline">
          Back to announcements
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link href="/announcements" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to announcements
      </Link>

      <div className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{announcement.title}</h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 dark:text-gray-500">
              <Calendar className="w-3 h-3" />
              {new Date(announcement.createdAt).toLocaleDateString()}
              {announcement.status === 'SENT' && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{announcement.body}</p>
        </div>
      </div>
    </div>
  );
}