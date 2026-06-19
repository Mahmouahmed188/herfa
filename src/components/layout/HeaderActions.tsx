'use client';

import * as React from 'react';
import { Bell, User as UserIcon, AlertCircle } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { User } from '@/types/api';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useCustomerNotifications,
  useUnreadCount,
  useMarkAsRead,
} from '@/features/notifications/hooks/useCustomerNotifications';
import * as api from '@/services/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Separated so the notification hooks only run when the user is authenticated.
function AuthenticatedActions({ user }: { user: User }) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const notificationsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: notifications } = useCustomerNotifications(1, 5);
  const { data: unreadData } = useUnreadCount();
  const markReadMutation = useMarkAsRead();

  const getDashboardPath = () => {
    if (user?.role === 'admin' || user?.role === 'SUPER_ADMIN') return '/admin/dashboard' as const;
    if (user?.role === 'provider') return '/technician/dashboard' as const;
    return '/client/dashboard' as const;
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative" ref={notificationsRef}>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={cn(
            'relative p-2.5 rounded-xl bg-surface-dark border border-surface-border text-gray-400 hover:text-white hover:border-primary/50 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
            showNotifications && 'text-primary border-primary/50 bg-primary/5'
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadData &&
            typeof unreadData === 'object' &&
            'count' in unreadData &&
            (unreadData as { count: number }).count > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background-dark" />
            )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 bg-background-dark border border-surface-border rounded-[24px] shadow-2xl overflow-hidden z-50"
            >
              <div className="p-4 border-b border-surface-border flex items-center justify-between">
                <h3 className="text-white font-bold">Notifications</h3>
                {unreadData &&
                  typeof unreadData === 'object' &&
                  'count' in unreadData &&
                  (unreadData as { count: number }).count > 0 && (
                    <button
                      onClick={() => markReadMutation.mutate(notifications?.map((n: any) => n.id))}
                      className="text-[10px] uppercase font-bold text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications && notifications.length > 0 ? (
                  notifications.map((n: any) => (
                    <div
                      key={n.id}
                      className="p-4 border-b border-surface-border/50 hover:bg-surface-dark transition-colors cursor-pointer group"
                    >
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-white font-medium mb-1">{n.title}</p>
                          <p className="text-[11px] text-gray-500 line-clamp-2">{n.body}</p>
                          <p className="text-[9px] text-gray-600 mt-2">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {!n.isRead && (
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center mx-auto mb-4 text-gray-600">
                      <Bell className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No notifications yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative group/tooltip">
        <Link href={getDashboardPath()}>
          <button className="p-2.5 rounded-xl bg-surface-dark border border-surface-border text-gray-400 hover:text-white hover:border-primary/50 transition-all duration-300 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
            <UserIcon className="w-5 h-5" />
          </button>
        </Link>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-xl">
          {user?.role === 'PROVIDER' ? 'Technician Portal' : 'User Dashboard'}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white" />
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
        onClick={() => api.logout()}
      >
        Sign Out
      </Button>
    </div>
  );
}

export function HeaderActions() {
  const t = useTranslations('Navbar');
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isAuthenticated || !user) {
    return (
      <Link href="/login">
        <Button className="rounded-xl px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          {t('login')}
        </Button>
      </Link>
    );
  }

  return <AuthenticatedActions user={user} />;
}
