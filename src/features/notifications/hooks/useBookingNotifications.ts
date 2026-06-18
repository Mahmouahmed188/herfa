import { useMemo } from 'react';
import { CustomerNotification } from '../types';

const BOOKING_NOTIFICATION_TYPES = [
  'BOOKING_CREATED',
  'BOOKING_ACCEPTED',
  'BOOKING_ASSIGNED',
  'BOOKING_STARTED',
  'BOOKING_COMPLETED',
  'BOOKING_CANCELLED',
  'BOOKING_UPDATE',
] as const;

export function useBookingNotifications(notifications: CustomerNotification[]) {
  return useMemo(() => {
    const bookingNotifications = notifications.filter((n) =>
      BOOKING_NOTIFICATION_TYPES.includes(n.type as any)
    );

    return {
      bookingNotifications,
      count: bookingNotifications.length,
      getBookingLink: (notification: CustomerNotification): string => {
        const bookingId = notification.metadata?.bookingId;
        if (bookingId) return `/client/jobs/${bookingId}`;
        return '/client/jobs';
      },
    };
  }, [notifications]);
}