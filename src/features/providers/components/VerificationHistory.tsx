'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Clock,
  XCircle,
  FileText,
  UserCheck,
  MessageSquare,
  RotateCcw,
  AlertTriangle,
  Upload,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerificationHistoryEvent } from '../schemas/verification';

const eventIcons: Record<string, React.ReactNode> = {
  SUBMITTED: <Clock className="h-4 w-4" />,
  STATUS_CHANGE: <AlertTriangle className="h-4 w-4" />,
  DOCUMENT_UPLOADED: <Upload className="h-4 w-4" />,
  DOCUMENT_REPLACED: <FileText className="h-4 w-4" />,
  DOCUMENT_REJECTED: <XCircle className="h-4 w-4" />,
  REVIEWER_ASSIGNED: <UserCheck className="h-4 w-4" />,
  NOTE_ADDED: <MessageSquare className="h-4 w-4" />,
  RESUBMITTED: <RotateCcw className="h-4 w-4" />,
};

const eventColors: Record<string, string> = {
  SUBMITTED: 'bg-amber-100 text-amber-600 border-amber-200',
  STATUS_CHANGE: 'bg-blue-100 text-blue-600 border-blue-200',
  DOCUMENT_UPLOADED: 'bg-green-100 text-green-600 border-green-200',
  DOCUMENT_REPLACED: 'bg-purple-100 text-purple-600 border-purple-200',
  DOCUMENT_REJECTED: 'bg-red-100 text-red-600 border-red-200',
  REVIEWER_ASSIGNED: 'bg-indigo-100 text-indigo-600 border-indigo-200',
  NOTE_ADDED: 'bg-gray-100 text-gray-600 border-gray-200',
  RESUBMITTED: 'bg-orange-100 text-orange-600 border-orange-200',
};

interface VerificationHistoryProps {
  events: VerificationHistoryEvent[];
  isLoading: boolean;
  isError: boolean;
}

export function VerificationHistory({ events, isLoading, isError }: VerificationHistoryProps) {
  const t = useTranslations('Verification');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('historyEmpty')}</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('historyEmpty')}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="relative pl-10">
            {/* Timeline dot */}
            <div
              className={cn(
                'absolute left-2.5 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-background',
                eventColors[event.eventType] || 'bg-gray-100 text-gray-600 border-gray-200'
              )}
            >
              {eventIcons[event.eventType] || <Clock className="h-3 w-3" />}
            </div>

            {/* Content */}
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">{event.description}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(event.timestamp).toLocaleString()}</span>
                {event.actor && (
                  <>
                    <span>·</span>
                    <span>{event.actor}</span>
                  </>
                )}
              </div>
              {event.fromStatus && event.toStatus && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{event.fromStatus}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{event.toStatus}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
