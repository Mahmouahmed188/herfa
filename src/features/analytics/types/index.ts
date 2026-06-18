// Analytics Types

export interface DashboardOverview {
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  activeProviders: number;
  pendingVerifications: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  openTickets: number;
  openDisputes: number;
  pendingRefunds: number;
  systemHealth: SystemHealth;
  recentActivity: RecentActivity[];
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  checks: HealthCheck[];
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail';
  message: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
}

export interface RevenueAnalytics {
  period: string;
  totalRevenue: number;
  averageDailyRevenue: number;
  revenueTrend: RevenueTrendItem[];
  monthlyRevenue: MonthlyRevenueItem[];
  revenueByService: RevenueByServiceItem[];
  revenueByProvider: RevenueByProviderItem[];
  refundStatistics: RefundStatistics;
}

export interface RevenueTrendItem {
  date: string;
  revenue: number;
}

export interface MonthlyRevenueItem {
  month: string;
  revenue: number;
  growth: number;
}

export interface RevenueByServiceItem {
  service: string;
  revenue: number;
  percentage: number;
}

export interface RevenueByProviderItem {
  provider: string;
  revenue: number;
  percentage: number;
}

export interface RefundStatistics {
  totalRefunds: number;
  totalRefundedAmount: number;
  refundRate: number;
  averageRefundAmount: number;
  refundReasons: RefundReasonItem[];
}

export interface RefundReasonItem {
  reason: string;
  count: number;
  percentage: number;
}

export interface UserAnalytics {
  period: string;
  newUsers: NewUserItem[];
  activeUsers: ActiveUserItem[];
  userGrowth: UserGrowth;
  userRetention: UserRetention;
  userDemographics: UserDemographics;
}

export interface NewUserItem {
  date: string;
  count: number;
}

export interface ActiveUserItem {
  date: string;
  count: number;
}

export interface UserGrowth {
  current: number;
  previous: number;
  growthRate: number;
  growthPercentage: number;
}

export interface UserRetention {
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

export interface UserDemographics {
  byRole: UserRoleItem[];
  byRegion: UserRegionItem[];
  byDevice: UserDeviceItem[];
}

export interface UserRoleItem {
  role: 'client' | 'technician' | 'admin';
  count: number;
  percentage: number;
}

export interface UserRegionItem {
  region: string;
  count: number;
  percentage: number;
}

export interface UserDeviceItem {
  device: 'mobile' | 'tablet' | 'desktop';
  count: number;
  percentage: number;
}

export interface ProviderAnalytics {
  period: string;
  newProviders: NewProviderItem[];
  activeProviders: ActiveProviderItem[];
  providerGrowth: ProviderGrowth;
  providerPerformance: ProviderPerformance;
  topProviders: TopProviderItem[];
}

export interface NewProviderItem {
  date: string;
  count: number;
}

export interface ActiveProviderItem {
  date: string;
  count: number;
}

export interface ProviderGrowth {
  current: number;
  previous: number;
  growthRate: number;
  growthPercentage: number;
}

export interface ProviderPerformance {
  averageRating: number;
  totalReviews: number;
  averageResponseTime: number;
  completionRate: number;
}

export interface TopProviderItem {
  id: string;
  name: string;
  revenue: number;
  bookings: number;
  rating: number;
  satisfaction: number;
}

export interface ChartData {
  chartType: 'line' | 'bar' | 'area';
  granularity: 'daily' | 'weekly' | 'monthly';
  data: ChartDataItem[];
  chartConfig: ChartConfig;
}

export interface ChartDataItem {
  label: string;
  revenue: number;
  profit: number;
  bookings: number;
}

export interface ChartConfig {
  xAxis: {
    type: string;
    dataKey: string;
  };
  yAxis: {
    type: string;
  };
  series: ChartSeries[];
}

export interface ChartSeries {
  name: string;
  dataKey: string;
  color: string;
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

// Query Types
export interface AnalyticsQuery {
  period?: '7d' | '30d' | '90d' | '1y' | 'custom';
  startDate?: string;
  endDate?: string;
  compare?: boolean;
}

export interface ChartQuery {
  chartType?: 'line' | 'bar' | 'area';
  period?: '7d' | '30d' | '90d' | '1y';
  granularity?: 'daily' | 'weekly' | 'monthly';
}