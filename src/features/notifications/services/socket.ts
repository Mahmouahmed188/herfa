import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { CustomerNotification } from '../types';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';

class NotificationSocketService {
  private socket: Socket | null = null;
  private reconnectionAttempts = 0;
  private maxReconnectionAttempts = 10;

  connect() {
    if (typeof window === 'undefined') return;
    if (this.socket?.connected) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    this.socket = io(`${SOCKET_URL}/notifications`, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectionAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to notifications socket');
      this.reconnectionAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection failed:', error.message);
      this.reconnectionAttempts++;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from notifications socket:', reason);
      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });
  }

  disconnect() {
    if (this.socket) {
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
    return this.socket?.connected || false;
  }
}

export const notificationSocketService = new NotificationSocketService();
