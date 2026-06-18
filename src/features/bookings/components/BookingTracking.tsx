'use client';

import { Navigation, Clock, MapPin, Wifi, WifiOff, Loader2, AlertCircle, Circle, Plug, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackingSession, TrackingEvent } from '../hooks/useTracking';
import { TrackingTimeline } from './TrackingTimeline';

interface BookingTrackingProps {
  session: TrackingSession | null;
  events: TrackingEvent[];
  isLoading: boolean;
  error: unknown;
  wsConnected: boolean;
}

const sessionStatusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  PAUSED: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  COMPLETED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  NOT_STARTED: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
};

function isProviderOnline(lastUpdated?: string | null): boolean {
  if (!lastUpdated) return false;
  const diff = Date.now() - new Date(lastUpdated).getTime();
  return diff < 30000;
}

function formatDuration(startedAt: string, endedAt?: string | null): string {
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const ms = end - start;
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function getPauseResumeEvents(events: TrackingEvent[]): TrackingEvent[] {
  return events.filter(
    (e) => e.type === 'STATUS_CHANGE' && (e.title.toLowerCase().includes('pause') || e.title.toLowerCase().includes('resume'))
  );
}

export function BookingTracking({ session, events, isLoading, error, wsConnected }: BookingTrackingProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 p-6 text-sm text-slate-500">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Failed to load tracking information.
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Navigation className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-gray-400">No active tracking session.</p>
        </CardContent>
      </Card>
    );
  }

  const latestEvent = events[events.length - 1];
  const online = isProviderOnline(session.lastUpdated);
  const pauseResumeEvents = getPauseResumeEvents(events);
  const hasDuration = !!session.startedAt;

  const getConnectionBadge = () => {
    if (wsConnected) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200">
          <Wifi className="w-3 h-3" /> Live
        </Badge>
      );
    }
    if (error && typeof error === 'string' && error.includes('WebSocket')) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 text-red-600 border-red-200">
          <Plug className="w-3 h-3" /> Disconnected
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-200">
        <WifiOff className="w-3 h-3" /> Polling
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" /> Live Tracking
        </CardTitle>
        <div className="flex items-center gap-2">
          {getConnectionBadge()}
          <Badge variant="outline" className={`flex items-center gap-1 ${online ? 'text-green-600 border-green-200' : 'text-slate-400 border-slate-200'}`}>
            <Circle className={`w-2.5 h-2.5 fill-current ${online ? 'text-green-500' : 'text-slate-400'}`} />
            {online ? 'Online' : 'Offline'}
          </Badge>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sessionStatusStyles[session.status] || ''}`}>
            {session.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {session.providerLatitude != null && session.providerLongitude != null && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{session.providerLatitude.toFixed(4)}, {session.providerLongitude.toFixed(4)}</span>
            </div>
          )}
          {session.eta && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
              <Clock className="w-4 h-4 text-primary" />
              <span>ETA: {new Date(session.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>

        {hasDuration && (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
            <Clock className="w-4 h-4 text-primary" />
            <span>Duration: {formatDuration(session.startedAt!, session.endedAt)}</span>
          </div>
        )}

        {session.lastUpdated && (
          <p className="text-xs text-slate-400 dark:text-gray-500">
            Last updated: {new Date(session.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}

        {latestEvent && (
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Latest Event</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{latestEvent.title}</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">{latestEvent.description}</p>
          </div>
        )}

        {session.startedAt && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Timeline
            </h4>
            <TrackingTimeline
              events={events}
              sessionStatus={session.status}
              startedAt={session.startedAt}
              endedAt={session.endedAt}
            />
          </div>
        )}

        {pauseResumeEvents.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" /> Session Events
            </h4>
            <div className="space-y-2">
              {pauseResumeEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    event.title.toLowerCase().includes('pause')
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    {event.title.toLowerCase().includes('pause') ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
