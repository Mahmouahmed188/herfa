'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingApi, TrackingSession, TrackingEvent } from '@/features/bookings/services/api';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

export type { TrackingSession, TrackingEvent } from '@/features/bookings/services/api';

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com/ws';

const RECONNECT_BASE = 5000;
const RECONNECT_MAX = 30000;

export function useTracking(bookingId: string) {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttemptRef = useRef(0);
  const [session, setSession] = useState<TrackingSession | null>(null);

  const {
    data: apiSession,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ['tracking', 'session', bookingId],
    queryFn: () => bookingApi.getTrackingSession(bookingId).then(r => r?.data ?? null),
    enabled: !!bookingId,
    refetchInterval: wsConnected ? false : 15000,
  });

  useEffect(() => {
    if (apiSession) setSession(apiSession);
  }, [apiSession]);

  const {
    data: events = [],
    isLoading: eventsLoading,
  } = useQuery({
    queryKey: ['tracking', 'events', bookingId],
    queryFn: () => bookingApi.getTrackingEvents(bookingId).then(r => (r?.data ?? []) as TrackingEvent[]),
    enabled: !!bookingId,
    refetchInterval: wsConnected ? false : 10000,
  });

  const connectWebSocket = useCallback(() => {
    if (!token || !bookingId || wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(`${WS_BASE}/tracking/${bookingId}?token=${token}`);

      ws.onopen = () => {
        setWsConnected(true);
        setWsError(null);
        reconnectAttemptRef.current = 0;
        ws.send(JSON.stringify({ type: 'SUBSCRIBE', bookingId }));
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          switch (message.type) {
            case 'LOCATION_UPDATE':
              setSession(prev => prev ? {
                ...prev,
                providerLatitude: message.latitude,
                providerLongitude: message.longitude,
                lastUpdated: message.timestamp,
              } : prev);
              break;
            case 'STATUS_CHANGE':
              setSession(prev => prev ? {
                ...prev,
                status: message.status === 'ON_THE_WAY' ? 'ACTIVE'
                      : message.status === 'COMPLETED' ? 'COMPLETED'
                      : prev.status,
              } : prev);
              queryClient.invalidateQueries({ queryKey: ['bookings', bookingId] });
              break;
            case 'ETA_UPDATE':
              setSession(prev => prev ? {
                ...prev,
                eta: message.eta,
              } : prev);
              break;
            case 'ERROR':
              toast.error(message.message);
              break;
          }
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onerror = () => {
        setWsError('WebSocket connection error');
        setWsConnected(false);
      };

      ws.onclose = () => {
        setWsConnected(false);
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        const delay = Math.min(RECONNECT_BASE * Math.pow(2, reconnectAttemptRef.current), RECONNECT_MAX);
        reconnectAttemptRef.current += 1;
        if (reconnectAttemptRef.current <= 5) {
          reconnectTimeoutRef.current = setTimeout(() => connectWebSocket(), delay);
        }
      };

      wsRef.current = ws;
    } catch {
      setWsError('Failed to create WebSocket connection');
    }
  }, [token, bookingId, queryClient]);

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsConnected(false);
    reconnectAttemptRef.current = 0;
  }, []);

  useEffect(() => {
    if (session?.status === 'ACTIVE') {
      connectWebSocket();
    }
    return () => disconnectWebSocket();
  }, [session?.status, connectWebSocket, disconnectWebSocket]);

  return {
    session,
    events,
    isLoading: sessionLoading || eventsLoading,
    error: sessionError || wsError,
    wsConnected,
  };
}