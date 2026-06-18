'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export interface TrackingSession {
  id: string;
  bookingId: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'NOT_STARTED';
  providerLatitude?: number | null;
  providerLongitude?: number | null;
  eta?: string | null;
  lastUpdated?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
}

export interface TrackingEvent {
  id: string;
  type: 'STATUS_CHANGE' | 'LOCATION_UPDATE' | 'MILESTONE' | 'ETA_UPDATE';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    latitude?: number;
    longitude?: number;
    eta?: string;
  };
}

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com/ws';

export function useTracking(bookingId: string) {
  const token = useAuthStore((state) => state.token);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ['tracking', 'session', bookingId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<TrackingSession>>(`/tracking/${bookingId}`);
      return response.data?.data ?? null;
    },
    enabled: !!bookingId,
    refetchInterval: wsConnected ? false : 15000,
  });

  const {
    data: events = [],
    isLoading: eventsLoading,
  } = useQuery({
    queryKey: ['tracking', 'events', bookingId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<TrackingEvent[]>>(`/tracking/${bookingId}/events`);
      return (response.data?.data ?? []) as TrackingEvent[];
    },
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
        ws.send(JSON.stringify({ type: 'SUBSCRIBE', bookingId }));
      };

      ws.onmessage = () => {
        // WebSocket messages handled by event listeners
      };

      ws.onerror = () => {
        setWsError('WebSocket connection error');
        setWsConnected(false);
      };

      ws.onclose = () => {
        setWsConnected(false);
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => connectWebSocket(), 5000);
      };

      wsRef.current = ws;
    } catch {
      setWsError('Failed to create WebSocket connection');
    }
  }, [token, bookingId]);

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsConnected(false);
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