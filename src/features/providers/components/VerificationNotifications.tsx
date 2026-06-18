'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, XCircle, Clock, ShieldAlert, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CustomerNotification } from '@/features/notifications/types';

const verificationIcons: Record<string, React.ReactNode> = {
  VERIFICATION_SUBMITTED: <Clock className="h-5 w-5 text-amber-500" />,
  VERIFICATION_APPROVED: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  VERIFICATION_REJECTED: <XCircle className="h-5 w-5 text-red-500" />,
  VERIFICATION_SUSPENDED: <ShieldAlert className="h-5 w-5 text-gray-500" />,
  DOCUMENTS_REQUESTED: <FileText className="h-5 w-5 text-blue-500" />,
};

interface VerificationNotificationsProps {
  notifications: CustomerNotification[];
  onMarkAsRead?: (id: string) => void;
}

export function VerificationNotifications({ notifications, onMarkAsRead }: VerificationNotificationsProps) {
  const t = useTranslations('Verification');

  if (notifications.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {t('title')}
      </h3>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-start gap-3 rounded-lg border p-4"
        >
          <div className="shrink-0 mt-0.5">
            {verificationIcons[notification.type] || <Clock className="h-5 w-5 text-muted-foreground" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{notification.body}</p>
            <div className="mt-2">
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                <Link
                  href={
                    ['VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'VERIFICATION_SUSPENDED'].includes(notification.type)
                      ? '/provider/verification'
                      : '/provider/verification/history'
                  }
                >
                  View Details
                </Link>
              </Button>
            </div>
          </div>
          {!notification.isRead && onMarkAsRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="shrink-0 text-xs text-primary hover:underline"
            >
              Mark read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
