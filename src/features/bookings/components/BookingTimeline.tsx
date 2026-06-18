'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, AlertTriangle, MessageSquare, UserCheck, UserPlus, UserX, XCircle, Flag, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineEvent {
  id: string;
  type: 'STATUS_CHANGE' | 'PROVIDER_ASSIGNED' | 'PROVIDER_ACCEPTED' | 'PROVIDER_REJECTED' | 'TRACKING_STARTED' | 'LOCATION_UPDATED' | 'CANCELLED' | 'COMPLETED' | 'PAYMENT' | 'DISPUTE' | 'MESSAGE';
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  metadata?: Record<string, any>;
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
      case 'PROVIDER_ASSIGNED': return UserPlus;
      case 'PROVIDER_ACCEPTED': return UserCheck;
      case 'PROVIDER_REJECTED': return UserX;
      case 'CANCELLED': return XCircle;
      case 'COMPLETED': return Flag;
      case 'TRACKING_STARTED': return Navigation;
      case 'LOCATION_UPDATED': return Navigation;
      default: return Clock;
    }
  };

  const getIconColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'STATUS_CHANGE': return 'text-green-500 bg-green-500/10';
      case 'PAYMENT': return 'text-blue-500 bg-blue-500/10';
      case 'DISPUTE': return 'text-destructive bg-destructive/10';
      case 'MESSAGE': return 'text-primary bg-primary/10';
      case 'PROVIDER_ASSIGNED':
      case 'PROVIDER_ACCEPTED': return 'text-blue-500 bg-blue-500/10';
      case 'PROVIDER_REJECTED': return 'text-orange-500 bg-orange-500/10';
      case 'CANCELLED': return 'text-red-500 bg-red-500/10';
      case 'COMPLETED': return 'text-green-500 bg-green-500/10';
      case 'TRACKING_STARTED':
      case 'LOCATION_UPDATED': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent dark:before:via-slate-700">
      {events.map((event) => {
        const Icon = getIcon(event.type);
        return (
          <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10",
              getIconColor(event.type)
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-900 dark:text-white">{event.title}</div>
                <time className="text-xs font-medium text-primary uppercase">
                  {format(new Date(event.timestamp), 'HH:mm')}
                </time>
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm">{event.description}</div>
              {event.actor && (
                <div className="mt-2 text-xs font-semibold text-slate-400">By {event.actor}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}