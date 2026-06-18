import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { CustomerNotification } from '../types';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';

function createSocketOptions(token: string) {
  return {
    // Send the token both ways — NestJS guards vary between expecting
    // a raw JWT and a "Bearer <jwt>" string. Sending both covers both patterns.
    auth: { token },
    // Also include in extraHeaders in case the guard reads from Authorization header.
    extraHeaders: { Authorization: `Bearer ${token}` },
    withCredentials: true, // send cookies alongside the connection
    transports: ['websocket', 'polling'] as ('websocket' | 'polling')[],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 15000,
  };
}

function attachBaseListeners(socket: Socket) {
  socket.on('connect', () => {
    console.log('Connected to notifications socket');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection failed:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from notifications socket:', reason);
    // EMERGENCY FIX: Do not trigger logout or prevent reconnection
    console.log('Socket - EMERGENCY FIX: Disconnect does not trigger logout');
    // Allow reconnection even with potentially stale tokens
  });
}

class NotificationSocketService {
  private socket: Socket | null = null;

  connect() {
    if (typeof window === 'undefined') return;
    if (this.socket?.connected) return;
    // Socket exists but disconnected — a server-side kick while mid-reconnect.
    // Don't stack another instance on top; caller must call disconnect() first.
    if (this.socket) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    this.socket = io(`${SOCKET_URL}/notifications`, createSocketOptions(token));
    attachBaseListeners(this.socket);
  }

  reconnectWithToken(token: string) {
    this.disconnect();
    if (!token) return;
    this.socket = io(`${SOCKET_URL}/notifications`, createSocketOptions(token));
    attachBaseListeners(this.socket);
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNotification(callback: (notification: CustomerNotification) => void) {
    this.socket?.on('notification', callback);
  }

  onUnreadCount(callback: (data: { count: number }) => void) {
    this.socket?.on('unread-count', callback);
  }

  offNotification(callback?: (notification: CustomerNotification) => void) {
    if (callback) {
      this.socket?.off('notification', callback);
    } else {
      this.socket?.off('notification');
    }
  }

  offUnreadCount(callback?: (data: { count: number }) => void) {
    if (callback) {
      this.socket?.off('unread-count', callback);
    } else {
      this.socket?.off('unread-count');
    }
  }

  get isConnected() {
    return this.socket?.connected ?? false;
  }
}

export const notificationSocketService = new NotificationSocketService();
