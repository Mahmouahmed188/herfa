'use client';

import { MapPin, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackingMapView } from '@/components/map/TrackingMapView';

interface TrackingMapProps {
  latitude?: number | null;
  longitude?: number | null;
  providerName?: string;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  status?: string;
  eta?: string | null;
  lastUpdated?: string | null;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

export function TrackingMap({
  latitude,
  longitude,
  providerName,
  destinationLatitude,
  destinationLongitude,
  status,
  eta,
  lastUpdated,
  isLoading,
  error,
  onRetry,
}: TrackingMapProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" /> Provider Location
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <TrackingMapView
          providerLatitude={latitude}
          providerLongitude={longitude}
          destinationLatitude={destinationLatitude}
          destinationLongitude={destinationLongitude}
          providerName={providerName}
          status={status}
          eta={eta}
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
        />
      </CardContent>
    </Card>
  );
}
