// Review Management Types

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number;
  comment: string | null;
  status: 'visible' | 'hidden' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface ReviewDetail {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number;
  comment: string | null;
  status: 'visible' | 'hidden' | 'pending';
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  provider: {
    id: string;
    name: string;
    email: string;
  };
  booking: {
    id: string;
    service: string;
    scheduledDate: string;
    scheduledTime: string;
  };
}

export interface ReviewQuery {
  page: number;
  limit: number;
  status?: 'visible' | 'hidden' | 'pending';
  rating?: number;
  providerId?: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ReviewAnalyticsOverview {
  period: string;
  totalReviews: number;
  averageRating: number;
  ratingTrend: RatingTrendItem[];
  ratingDistribution: RatingDistributionItem[];
  reviewSentiment: ReviewSentiment;
  reviewByService: ReviewByServiceItem[];
}

export interface RatingTrendItem {
  date: string;
  rating: number;
  count: number;
}

export interface RatingDistributionItem {
  rating: number;
  count: number;
  percentage: number;
}

export interface ReviewSentiment {
  positive: number;
  neutral: number;
  negative: number;
}

export interface ReviewByServiceItem {
  service: string;
  averageRating: number;
  totalReviews: number;
}

export interface ReviewSentimentAnalysis {
  sentimentAnalysis: SentimentAnalysisItem[];
  commonKeywords: KeywordAnalysisItem[];
  reviewTopics: TopicAnalysisItem[];
}

export interface SentimentAnalysisItem {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface KeywordAnalysisItem {
  keyword: string;
  positive: number;
  negative: number;
  total: number;
}

export interface TopicAnalysisItem {
  topic: 'service' | 'provider' | 'price' | 'communication' | 'quality';
  sentiment: 'positive' | 'neutral' | 'negative';
  count: number;
  percentage: number;
}

export interface ReviewAction {
  action: 'hide' | 'restore';
  reason: string;
  notes?: string;
}

export interface ReviewHide {
  reason: string;
  notes?: string;
}

export interface ReviewRestore {
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Dashboard Types
export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  pendingReviews: number;
  hiddenReviews: number;
  reviewGrowth: number;
  sentimentScore: number;
}

export interface RatingBreakdown {
  rating: number;
  count: number;
  percentage: number;
  barWidth: string;
}

export interface RecentReview {
  id: string;
  customer: string;
  provider: string;
  rating: number;
  comment: string | null;
  status: string;
  createdAt: string;
}

export interface ServiceRating {
  service: string;
  averageRating: number;
  totalReviews: number;
  ratingTrend: RatingTrendItem[];
}

// Form Types
export interface ReviewFormData {
  rating: number;
  comment?: string;
}

export interface ReviewModerationFormData {
  action: 'hide' | 'restore';
  reason: string;
  notes?: string;
}

// Chart Types
export interface RatingChart {
  type: 'bar' | 'line' | 'pie';
  data: RatingChartData[];
  config: ChartConfig;
}

export interface RatingChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  xAxis?: {
    type: string;
    dataKey: string;
  };
  yAxis?: {
    type: string;
  };
  series?: ChartSeries[];
}

export interface ChartSeries {
  name: string;
  dataKey: string;
  color: string;
}

// Sentiment Analysis Types
export interface SentimentSummary {
  overall: 'positive' | 'neutral' | 'negative';
  score: number;
  confidence: number;
}

export interface SentimentByCategory {
  category: 'service' | 'provider' | 'price' | 'communication' | 'quality';
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  count: number;
}

// Error Types
export interface ReviewError {
  code: string;
  message: string;
  details?: string;
}

// Loading States
export interface ReviewLoadingState {
  isLoading: boolean;
  isUpdating: boolean;
  isModerating: boolean;
  isAnalyzing: boolean;
}

// Filter Types
export interface ReviewFilter {
  status?: 'visible' | 'hidden' | 'pending';
  rating?: number;
  providerId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

// Export Types
export interface ReviewExportData {
  reviews: ReviewDetail[];
  summary: ReviewAnalyticsOverview;
  exportDate: string;
}

// Notification Types
export interface ReviewNotification {
  id: string;
  type: 'new_review' | 'review_flagged' | 'review_moderated';
  reviewId: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}