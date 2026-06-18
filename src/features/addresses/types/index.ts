import { BaseEntity } from '@/types/api';

export interface Address extends BaseEntity {
  id: string;
  userId: string;
  label: string;
  street: string;
  building?: string;
  city: string;
  area: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  phone?: string;
  additionalInstructions?: string;
}
