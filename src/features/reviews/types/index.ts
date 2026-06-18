import { BaseEntity } from '@/types/api';

export enum ModerationDisplayState {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  FLAGGED = 'FLAGGED',
  REJECTED = 'REJECTED',
}

export interface Review extends Omit<BaseEntity, 'createdAt' | 'updatedAt'> {
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment?: string;
  isApproved: boolean;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCreateRequest {
  bookingId: string;
  providerId: string;
  rating: number;
  comment?: string;
}

export interface ReviewUpdateRequest {
  rating?: number;
  comment?: string;
}

export interface ReviewDetail extends Review {
  customer?: { id: string; name: string };
  provider?: { id: string; name: string };
}

export interface RatingStats {
  providerId: string;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  ratingDistribution: Record<string, number>;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'ASC' | 'DESC';
}

export interface AdminReviewFilters extends ReviewFilters {
  status?: 'all' | 'pending' | 'flagged';
}

export interface ReviewTrendData {
  date: string;
  count: number;
  average: number;
}

export interface AnalyticsData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  trendData?: ReviewTrendData[];
}

export function deriveModerationState(
  isApproved: boolean,
  isFlagged: boolean
): ModerationDisplayState {
  if (isFlagged) return ModerationDisplayState.FLAGGED;
  if (isApproved) return ModerationDisplayState.APPROVED;
  return ModerationDisplayState.PENDING;
}
