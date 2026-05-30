'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, XCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  type: 'STATUS_CHANGE' | 'PAYMENT' | 'DISPUTE' | 'MESSAGE';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface BookingTimelineProps {
  events: TimelineEvent[];
}

export function BookingTimeline({ events }: BookingTimelineProps) {
  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'STATUS_CHANGE': return CheckCircle2;
      case 'PAYMENT': return Clock;
      case 'DISPUTE': return AlertTriangle;
      case 'MESSAGE': return MessageSquare;
      default: return Clock;
    }
  };

  const getIconColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'STATUS_CHANGE': return 'text-green-500 bg-green-500/10';
      case 'PAYMENT': return 'text-blue-500 bg-blue-500/10';
      case 'DISPUTE': return 'text-destructive bg-destructive/10';
      case 'MESSAGE': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent dark:before:via-slate-700">
      {events.map((event, index) => {
        const Icon = getIcon(event.type);
        return (
          <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10",
              getIconColor(event.type)
            )}>
              <Icon className="w-5 h-5" />
            </div>
            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-900 dark:text-white">{event.title}</div>
                <time className="text-xs font-medium text-primary uppercase">
                  {format(new Date(event.timestamp), 'HH:mm')}
                </time>
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm">{event.description}</div>
              {event.user && (
                <div className="mt-2 text-xs font-semibold text-slate-400">By {event.user}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
