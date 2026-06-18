// Dashboard Types

// KPI and Overview Types
export interface KpiCard {
  title: string;
  value: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  description?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  checks: HealthCheck[];
  lastChecked: string;
  uptime: number;
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
  targetType: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Platform Overview Types
export interface PlatformOverview {
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
  growthRate: number;
}

export interface BusinessMetrics {
  conversionRate: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  providerSatisfaction: number;
  customerSatisfaction: number;
}

export interface GrowthMetrics {
  userGrowth: number;
  providerGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
}

export interface ActivityMetrics {
  dailyActiveUsers: number;
  dailyActiveProviders: number;
  peakHours: PeakHour[];
  popularServices: PopularService[];
}

export interface PeakHour {
  hour: number;
  activity: number;
}

export interface PopularService {
  service: string;
  count: number;
}

// Chart Data Types
export interface ChartData {
  period: string;
  totalRevenue: number;
  averageDailyRevenue: number;
  revenueTrend: RevenueTrendItem[];
  monthlyRevenue: MonthlyRevenueItem[];
  revenueByService: RevenueByServiceItem[];
  revenueByProvider: RevenueByProviderItem[];
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

export interface UserChartData {
  newUsers: NewUserItem[];
  activeUsers: ActiveUserItem[];
  userGrowth: UserGrowth;
  userRetention: UserRetention;
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

export interface BookingChartData {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  disputedBookings: number;
  bookingTrend: BookingTrendItem[];
  bookingStatusDistribution: BookingStatusItem[];
}

export interface BookingTrendItem {
  date: string;
  total: number;
  completed: number;
  cancelled: number;
}

export interface BookingStatusItem {
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  count: number;
  percentage: number;
}

// Analytics Overview Types
export interface AnalyticsOverview {
  period: string;
  platformOverview: PlatformOverview;
  businessMetrics: BusinessMetrics;
  growthMetrics: GrowthMetrics;
  activityMetrics: ActivityMetrics;
  systemHealth: SystemHealth;
  recentActivity: RecentActivity[];
  timestamp: string;
}

// Widget Types
export interface Widget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'list';
  title: string;
  size: 'small' | 'medium' | 'large';
  data: any;
  config: WidgetConfig;
}

export interface WidgetConfig {
  refreshInterval?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  enableExport?: boolean;
}

// Dashboard Layout Types
export interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  createdAt: string;
  updatedAt: string;
}

// Filter and Query Types
export interface DashboardQuery {
  period?: '7d' | '30d' | '90d' | '1y' | 'custom';
  startDate?: string;
  endDate?: string;
  compare?: boolean;
  filters?: Record<string, any>;
}

export interface TimeRange {
  start: string;
  end: string;
  label: string;
}

// Notification Types
export interface DashboardNotification {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

// Export Types
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel' | 'json';
  includeCharts: boolean;
  includeFilters: boolean;
  dateRange: {
    start: string;
    end: string;
  };
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

// Error Types
export interface DashboardError {
  code: string;
  message: string;
  details?: string;
}

// Loading States
export interface DashboardLoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  isExporting: boolean;
  isSavingLayout: boolean;
}

// Chart Configuration Types
export interface ChartConfig {
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'scatter';
  xAxis: {
    type: string;
    dataKey: string;
    title?: string;
  };
  yAxis: {
    type: string;
    title?: string;
  };
  series: ChartSeries[];
  legend?: {
    show: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
  };
}

export interface ChartSeries {
  name: string;
  dataKey: string;
  color: string;
  type?: 'line' | 'bar' | 'area';
}

// Time Series Data Types
export interface TimeSeriesData {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

// Summary Statistics Types
export interface SummaryStats {
  total: number;
  average: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  changePercentage: number;
}

// Real-time Updates Types
export interface RealtimeUpdate {
  type: 'metric' | 'activity' | 'alert';
  data: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}