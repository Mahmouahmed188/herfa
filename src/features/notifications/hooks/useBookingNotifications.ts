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
  'TRACKING_STARTED',
  'TRACKING_PAUSED',
  'TRACKING_RESUMED',
  'TRACKING_ARRIVED',
] as const;

const TRACKING_NOTIFICATION_TYPES = new Set([
  'TRACKING_STARTED',
  'TRACKING_PAUSED',
  'TRACKING_RESUMED',
  'TRACKING_ARRIVED',
]);

export function useBookingNotifications(notifications: CustomerNotification[]) {
  return useMemo(() => {
    const bookingNotifications = notifications.filter((n) =>
      BOOKING_NOTIFICATION_TYPES.includes(n.type as (typeof BOOKING_NOTIFICATION_TYPES)[number])
    );

    return {
      bookingNotifications,
      count: bookingNotifications.length,
      getBookingLink: (notification: CustomerNotification): string => {
        const bookingId = notification.data?.bookingId;
        if (!bookingId) return '/client/jobs';
        if (TRACKING_NOTIFICATION_TYPES.has(notification.type as string)) {
          return `/client/tracking/${bookingId}`;
        }
        return `/client/jobs/${bookingId}`;
      },
    };
  }, [notifications]);
}
