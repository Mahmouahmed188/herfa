import { useMemo } from 'react';
import { VerificationNotificationType, CustomerNotification } from '../types';

const VERIFICATION_TYPES: VerificationNotificationType[] = [
  'VERIFICATION_SUBMITTED',
  'VERIFICATION_APPROVED',
  'VERIFICATION_REJECTED',
  'VERIFICATION_SUSPENDED',
  'DOCUMENTS_REQUESTED',
];

export function useVerificationNotifications(notifications: CustomerNotification[]) {
  return useMemo(() => {
    const verificationNotifications = notifications.filter((n) =>
      VERIFICATION_TYPES.includes(n.type as VerificationNotificationType)
    );

    return {
      verificationNotifications,
      count: verificationNotifications.length,
      getLink: (notification: CustomerNotification): string => {
        switch (notification.type) {
          case 'VERIFICATION_APPROVED':
          case 'VERIFICATION_REJECTED':
          case 'VERIFICATION_SUSPENDED':
            return '/provider/verification';
          case 'VERIFICATION_SUBMITTED':
          case 'DOCUMENTS_REQUESTED':
            return '/provider/verification/history';
          default:
            return '/provider/verification';
        }
      },
    };
  }, [notifications]);
}
