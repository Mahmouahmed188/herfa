import { z } from 'zod';

// KPI Card Data Schema
export const KpiCardSchema = z.object({
  title: z.string(),
  value: z.number(),
  change: z.number(),
  changeType: z.enum(['positive', 'negative', 'neutral']),
  icon: z.string(),
  description: z.string().optional(),
});

// System Health Check Schema
export const SystemHealthCheckSchema = z.object({
  name: z.string(),
  status: z.enum(['pass', 'fail']),
  message: z.string(),
  timestamp: z.string(),
});

// System Health Schema
export const SystemHealthSchema = z.object({
  status: z.enum(['healthy', 'warning', 'critical']),
  checks: z.array(SystemHealthCheckSchema),
  lastChecked: z.string(),
  uptime: z.number(),
});

// Recent Activity Item Schema
export const RecentActivityItemSchema = z.object({
  id: z.string(),
  action: z.string(),
  actor: z.string(),
  target: z.string(),
  targetType: z.string(),
  timestamp: z.string(),
  details: z.record(z.any()).optional(),
});

// Recent Activity Schema
export const RecentActivitySchema = z.object({
  activities: z.array(RecentActivityItemSchema),
  total: z.number(),
  lastUpdated: z.string(),
});

// Platform Overview Schema
export const PlatformOverviewSchema = z.object({
  totalUsers: z.number(),
  totalCustomers: z.number(),
  totalProviders: z.number(),
  activeProviders: z.number(),
  pendingVerifications: z.number(),
  totalBookings: z.number(),
  activeBookings: z.number(),
  totalRevenue: z.number(),
  openTickets: z.number(),
  openDisputes: z.number(),
  pendingRefunds: z.number(),
  growthRate: z.number(),
});

// Business Metrics Schema
export const BusinessMetricsSchema = z.object({
  conversionRate: z.number(),
  averageOrderValue: z.number(),
  customerLifetimeValue: z.number(),
  providerSatisfaction: z.number(),
  customerSatisfaction: z.number(),
});

// Growth Metrics Schema
export const GrowthMetricsSchema = z.object({
  userGrowth: z.number(),
  providerGrowth: z.number(),
  bookingGrowth: z.number(),
  revenueGrowth: z.number(),
});

// Activity Metrics Schema
export const ActivityMetricsSchema = z.object({
  dailyActiveUsers: z.number(),
  dailyActiveProviders: z.number(),
  peakHours: z.array(z.object({
    hour: z.number(),
    activity: z.number(),
  })),
  popularServices: z.array(z.object({
    service: z.string(),
    count: z.number(),
  })),
});

// Dashboard Overview Schema
export const DashboardOverviewSchema = z.object({
  platformOverview: PlatformOverviewSchema,
  businessMetrics: BusinessMetricsSchema,
  growthMetrics: GrowthMetricsSchema,
  activityMetrics: ActivityMetricsSchema,
  systemHealth: SystemHealthSchema,
  recentActivity: RecentActivitySchema,
  timestamp: z.string(),
});

// Revenue Chart Data Schema
export const RevenueChartDataSchema = z.object({
  period: z.string(),
  totalRevenue: z.number(),
  averageDailyRevenue: z.number(),
  revenueTrend: z.array(z.object({
    date: z.string(),
    revenue: number,
  })),
  monthlyRevenue: z.array(z.object({
    month: string,
    revenue: number,
    growth: number,
  })),
  revenueByService: z.array(z.object({
    service: string,
    revenue: number,
    percentage: number,
  })),
});

// User Chart Data Schema
export const UserChartDataSchema = z.object({
  newUsers: z.array(z.object({
    date: string,
    count: number,
  })),
  activeUsers: z.array(z.object({
    date: string,
    count: number,
  })),
  userGrowth: z.object({
    current: number,
    previous: number,
    growthRate: number,
    growthPercentage: number,
  }),
  userRetention: z.object({
    day1: number,
    day7: number,
    day30: number,
    day90: number,
  }),
});

// Booking Chart Data Schema
export const BookingChartDataSchema = z.object({
  totalBookings: number,
  completedBookings: number,
  cancelledBookings: number,
  disputedBookings: number,
  bookingTrend: z.array(z.object({
    date: string,
    total: number,
    completed: number,
    cancelled: number,
  })),
  bookingStatusDistribution: z.array(z.object({
    status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed']),
    count: number,
    percentage: number,
  })),
});

// Analytics Chart Config Schema
export const AnalyticsChartConfigSchema = z.object({
  chartType: z.enum(['line', 'bar', 'area', 'pie']),
  xAxis: z.object({
    type: z.string(),
    dataKey: z.string(),
    title: z.string().optional(),
  }),
  yAxis: z.object({
    type: z.string(),
    title: z.string().optional(),
  }),
  series: z.array(z.object({
    name: string,
    dataKey: string,
    color: string,
    type: z.enum(['line', 'bar', 'area']).optional(),
  })),
  legend: z.object({
    show: z.boolean(),
    position: z.enum(['top', 'bottom', 'left', 'right']).optional(),
  }).optional(),
});

// Export all schemas
export const DashboardSchemas = {
  kpiCard: KpiCardSchema,
  systemHealthCheck: SystemHealthCheckSchema,
  systemHealth: SystemHealthSchema,
  recentActivityItem: RecentActivityItemSchema,
  recentActivity: RecentActivitySchema,
  platformOverview: PlatformOverviewSchema,
  businessMetrics: BusinessMetricsSchema,
  growthMetrics: GrowthMetricsSchema,
  activityMetrics: ActivityMetricsSchema,
  overview: DashboardOverviewSchema,
  revenueChartData: RevenueChartDataSchema,
  userChartData: UserChartDataSchema,
  bookingChartData: BookingChartDataSchema,
  chartConfig: AnalyticsChartConfigSchema,
};