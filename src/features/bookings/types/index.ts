import { BaseEntity } from '@/types/api';

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'ON_THE_WAY' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

export interface ServiceInfo {
  id: string;
  name: string;
  category?: string;
}

export interface ProviderInfo {
  id: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  rating?: number;
}

export interface PaymentInfo {
  status: 'PAID' | 'UNPAID' | 'REFUNDED';
  method?: string;
  paidAt?: string;
}

export interface TrackingInfo {
  available: boolean;
  eta?: string;
  providerLatitude?: number;
  providerLongitude?: number;
  lastUpdated?: string;
}

export interface TimelineEvent {
  status: string;
  timestamp: string;
  note?: string;
}

export interface CustomerBooking extends BaseEntity {
  id: string;
  title?: string;
  description?: string;
  status: BookingStatus;
  service: ServiceInfo;
  provider?: ProviderInfo | null;
  address?: string;
  scheduledAt?: string;
  notes?: string;
  amount?: number;
  payment?: PaymentInfo | null;
  tracking?: TrackingInfo | null;
  timeline?: TimelineEvent[];
}

export interface BookingFiltersState {
  status?: BookingStatus | 'ALL';
  sort: 'newest' | 'oldest';
  page: number;
  limit: number;
}
