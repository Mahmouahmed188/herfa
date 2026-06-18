'use client';

import { MapPin, Navigation, Clock, Play, Flag, ArrowRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrackingEvent } from '../hooks/useTracking';

interface TrackingTimelineProps {
  events: TrackingEvent[];
  sessionStatus?: string;
  startedAt?: string | null;
  endedAt?: string | null;
}

function getEventIcon(type: TrackingEvent['type']) {
  switch (type) {
    case 'LOCATION_UPDATE': return MapPin;
    case 'STATUS_CHANGE': return ArrowRight;
    case 'ETA_UPDATE': return Clock;
    case 'MILESTONE': return Flag;
    default: return Circle;
  }
}

function getEventColor(type: TrackingEvent['type']) {
  switch (type) {
    case 'LOCATION_UPDATE': return 'text-blue-500 bg-blue-500/10';
    case 'STATUS_CHANGE': return 'text-purple-500 bg-purple-500/10';
    case 'ETA_UPDATE': return 'text-amber-500 bg-amber-500/10';
    case 'MILESTONE': return 'text-green-500 bg-green-500/10';
    default: return 'text-muted-foreground bg-muted';
  }
}

export function TrackingTimeline({ events, sessionStatus, startedAt, endedAt }: TrackingTimelineProps) {
  const hasNoData = events.length === 0 && !startedAt && !endedAt;

  if (hasNoData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Navigation className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm text-slate-500 dark:text-gray-400">No tracking events yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {startedAt && (
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <Play className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white">Tracking Started</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              {new Date(startedAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {events.map((event) => {
        const Icon = getEventIcon(event.type);
        return (
          <div key={event.id} className="flex items-center gap-3 text-sm">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", getEventColor(event.type))}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">{event.description}</p>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        );
      })}

      {endedAt && (
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0">
            <Flag className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white">Tracking {sessionStatus === 'COMPLETED' ? 'Completed' : 'Ended'}</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              {new Date(endedAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
