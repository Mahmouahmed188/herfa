'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Navigation, ChevronDown, ChevronUp, Loader2, Calendar } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { bookingApi } from '@/features/bookings/services/api';
import { BookingPagination } from '@/features/bookings/components/BookingPagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TRACKING_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
] as const;

type TrackingFilterStatus = (typeof TRACKING_STATUS_OPTIONS)[number]['value'];

const LIMIT = 10;

function formatDuration(startedAt?: string | null, endedAt?: string | null): string {
  if (!startedAt) return 'N/A';
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const ms = end - start;
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return '< 1m';
}

export default function TrackingHistoryPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TrackingFilterStatus>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: trackingSessions, isLoading } = useQuery({
    queryKey: ['trackingHistory', page, statusFilter, sortOrder],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(LIMIT),
        sort: sortOrder,
      };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const response = await bookingApi.getMyJobs(params);
      return response?.data ?? [];
    },
  });

  const sessions = Array.isArray(trackingSessions) ? trackingSessions : [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tracking History</h1>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
          Review your past tracking sessions.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {TRACKING_STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => { setStatusFilter(option.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === option.value
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-surface-dark text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-surface-border'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <select
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value as 'newest' | 'oldest'); setPage(1); }}
          className="ml-auto px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-sm text-slate-700 dark:text-gray-300"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm text-slate-500 dark:text-gray-400">No tracking history found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const isExpanded = expandedId === session.id;
            return (
              <Card key={session.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="w-full text-left"
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                          Tracking Session
                        </CardTitle>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          {session.startedAt
                            ? new Date(session.startedAt).toLocaleDateString()
                            : 'No date'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={
                        session.status === 'COMPLETED' ? 'text-green-600 border-green-200' :
                        session.status === 'ACTIVE' ? 'text-green-600 border-green-200' :
                        'text-amber-600 border-amber-200'
                      }>
                        {session.status}
                      </Badge>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </CardHeader>
                </button>

                {isExpanded && (
                  <CardContent className="border-t border-slate-100 dark:border-surface-border pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Duration</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {formatDuration(session.startedAt, session.endedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Status</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{session.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Started</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {session.startedAt ? new Date(session.startedAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Ended</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {session.endedAt ? new Date(session.endedAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {session.providerLatitude != null && session.providerLongitude != null && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 pt-2 border-t border-slate-100 dark:border-surface-border">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-xs font-mono">
                          {session.providerLatitude.toFixed(4)}, {session.providerLongitude.toFixed(4)}
                        </span>
                      </div>
                    )}
                    <Link
                      href={{ pathname: '/client/jobs/[id]', params: { id: session.bookingId } }}
                      className="inline-block text-xs font-semibold text-primary hover:underline pt-2"
                    >
                      View Booking Details
                    </Link>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {sessions.length > 0 && (
        <BookingPagination
          page={page}
          totalPages={Math.ceil(sessions.length / LIMIT) + 1}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
