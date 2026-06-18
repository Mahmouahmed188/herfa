'use client';

import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrackingMapProps {
  latitude?: number | null;
  longitude?: number | null;
  providerName?: string;
}

export function TrackingMap({ latitude, longitude, providerName }: TrackingMapProps) {
  if (latitude == null || longitude == null) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-gray-400">Provider location not available.</p>
        </CardContent>
      </Card>
    );
  }

  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" /> Provider Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all"
        >
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
            <MapPin className="w-10 h-10 text-primary" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {providerName || 'Provider'}&apos;s Location
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            </div>
            <span className="text-xs text-primary font-medium underline">
              Open in Google Maps
            </span>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}