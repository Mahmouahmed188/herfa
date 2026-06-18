'use client';

import { Navigation, Clock, MapPin, Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackingSession, TrackingEvent } from '../hooks/useTracking';

interface BookingTrackingProps {
  session: TrackingSession | null;
  events: TrackingEvent[];
  isLoading: boolean;
  error: any;
  wsConnected: boolean;
}

const sessionStatusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  PAUSED: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  COMPLETED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  NOT_STARTED: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
};

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" /> Live Tracking
        </CardTitle>
        <div className="flex items-center gap-2">
          {wsConnected ? (
            <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200">
              <Wifi className="w-3 h-3" /> Live
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-200">
              <WifiOff className="w-3 h-3" /> Polling
            </Badge>
          )}
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

        {latestEvent && (
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">Latest Event</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{latestEvent.title}</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">{latestEvent.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}