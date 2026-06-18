'use client';

import dynamic from 'next/dynamic';
import { Loader2, AlertCircle, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((m) => m.Polyline), { ssr: false });

interface TrackingMapViewProps {
  providerLatitude?: number | null;
  providerLongitude?: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  providerName?: string;
  status?: string;
  eta?: string | null;
  lastUpdated?: string | null;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

function DefaultMapSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
}

export function TrackingMapView({
  providerLatitude,
  providerLongitude,
  destinationLatitude,
  destinationLongitude,
  providerName,
  status,
  eta,
  lastUpdated,
  isLoading,
  error,
  onRetry,
}: TrackingMapViewProps) {
  if (isLoading) {
    return <DefaultMapSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-10 h-10 text-destructive mb-3" />
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">Failed to load map.</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (providerLatitude == null || providerLongitude == null) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-gray-400">Provider location not available.</p>
        </CardContent>
      </Card>
    );
  }

  const hasDestination = destinationLatitude != null && destinationLongitude != null;
  const center: [number, number] = [providerLatitude, providerLongitude];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="aspect-video w-full">
          <MapContainer
            center={center}
            zoom={15}
            className="w-full h-full z-0"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center}>
              <Popup>
                <div className="text-sm font-semibold">{providerName || 'Provider'}</div>
                {eta && <div className="text-xs text-slate-500">ETA: {new Date(eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
              </Popup>
            </Marker>
            {hasDestination && (
              <Marker position={[destinationLatitude, destinationLongitude]}>
                <Popup>
                  <div className="text-sm font-semibold">Destination</div>
                </Popup>
              </Marker>
            )}
            {hasDestination && (
              <Polyline
                positions={[
                  [providerLatitude, providerLongitude],
                  [destinationLatitude, destinationLongitude],
                ]}
                color="#2563eb"
                weight={3}
                opacity={0.6}
                dashArray="10 10"
              />
            )}
          </MapContainer>
        </div>
        {(status || eta || lastUpdated) && (
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 z-[1000]">
            {status && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-sm backdrop-blur-sm">
                {status}
              </span>
            )}
            {eta && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-sm backdrop-blur-sm">
                ETA: {new Date(eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {lastUpdated && (
              <span className="px-2.5 py-1 rounded-full text-xs bg-white/90 dark:bg-slate-900/90 text-slate-500 dark:text-gray-400 shadow-sm backdrop-blur-sm">
                Updated: {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
