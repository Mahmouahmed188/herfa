'use client';

import {
  TrendingUp, ClipboardList, CheckCircle2,
  Clock, Bell, Gift, ArrowRight, Plus
} from 'lucide-react';
import { Link } from "@/lib/navigation";
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useDashboardStats } from '@/features/client/hooks/useDashboardStats';
import { useUnreadCount } from '@/features/notifications/hooks/useCustomerNotifications';
import { ProfileSummary } from '@/features/client/components/ProfileSummary';
import { ActiveBookingList } from '@/features/bookings/components/ActiveBookingList';
import { useActiveBookings } from '@/features/bookings/hooks/useActiveBookings';

function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 w-24 bg-slate-200 dark:bg-surface-border rounded" />
        <div className="h-5 w-5 bg-slate-200 dark:bg-surface-border rounded" />
      </div>
      <div className="h-8 w-16 bg-slate-200 dark:bg-surface-border rounded mb-1" />
      <div className="h-3 w-32 bg-slate-200 dark:bg-surface-border rounded" />
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: unreadData } = useUnreadCount();
  const { data: activeBookings, isLoading: activeLoading } = useActiveBookings();

  const unreadCount = unreadData && typeof unreadData === 'object' && 'count' in unreadData
    ? (unreadData as { count: number }).count
    : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
            Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'User'}
          </p>
        </div>
        <Link
          href="/client/create-job"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/20 col-span-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
              <div className="flex items-start justify-between mb-4">
                <p className="text-white/70 text-sm font-medium">Active Orders</p>
                <ClipboardList className="w-5 h-5 text-white/60" />
              </div>
              <p className="text-3xl font-bold mb-1">{stats?.activeOrders ?? 0}</p>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>Currently in progress</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Pending Orders</p>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats?.pendingCount ?? 0}</p>
              <p className="text-xs text-slate-400 dark:text-gray-500">Awaiting confirmation</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Completed Jobs</p>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stats?.completedCount ?? 0}</p>
              <p className="text-xs text-slate-400 dark:text-gray-500">Lifetime total</p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Notifications</p>
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {unreadCount}
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-400 dark:text-gray-500">unread</span>
                )}
              </p>
              <Link href="/client/notifications" className="text-xs text-primary font-semibold hover:underline">
                View all notifications
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 dark:text-white">Current Active Orders</h2>
            <Link href="/client/jobs" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ActiveBookingList
            bookings={activeBookings ?? []}
            isLoading={activeLoading}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4">Profile</h2>
            <ProfileSummary />
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-slate-500" />
              <h2 className="font-bold text-slate-900 dark:text-white">Notifications</h2>
              {unreadCount > 0 && (
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 ? (
              <p className="text-sm text-slate-500 dark:text-gray-400">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-gray-400">No unread notifications.</p>
            )}
            <Link href="/client/notifications" className="text-primary text-sm font-semibold hover:underline mt-3 inline-block">
              View all notifications
            </Link>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-background-dark dark:bg-surface-dark border border-surface-border p-6 flex items-center justify-between gap-4">
        <div className="absolute right-0 top-0 w-64 h-full opacity-5">
          <div className="w-full h-full bg-primary rounded-full blur-3xl" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-white">Refer a friend & get $50</p>
            <p className="text-gray-400 text-sm">Share your unique code and earn rewards for every signup.</p>
          </div>
        </div>
        <button className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
          Share Code
        </button>
      </div>
    </div>
  );
}
