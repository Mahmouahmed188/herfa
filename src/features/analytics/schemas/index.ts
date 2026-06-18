import { z } from 'zod';

// Dashboard Overview Schema
export const DashboardOverviewSchema = z.object({
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
  systemHealth: z.object({
    status: z.enum(['healthy', 'warning', 'critical']),
    checks: z.array(z.object({
      name: z.string(),
      status: z.enum(['pass', 'fail']),
      message: z.string(),
    })),
  }),
  recentActivity: z.array(z.object({
    id: z.string(),
    action: z.string(),
    actor: z.string(),
    target: z.string(),
    timestamp: z.string(),
  })),
});

// Revenue Analytics Schema
export const RevenueAnalyticsSchema = z.object({
  period: z.string(),
  totalRevenue: z.number(),
  averageDailyRevenue: z.number(),
  revenueTrend: z.array(z.object({
    date: z.string(),
    revenue: z.number(),
  })),
  monthlyRevenue: z.array(z.object({
    month: z.string(),
    revenue: z.number(),
    growth: z.number(),
  })),
  revenueByService: z.array(z.object({
    service: z.string(),
    revenue: z.number(),
    percentage: z.number(),
  })),
  revenueByProvider: z.array(z.object({
    provider: z.string(),
    revenue: z.number(),
    percentage: z.number(),
  })),
  refundStatistics: z.object({
    totalRefunds: z.number(),
    totalRefundedAmount: z.number(),
    refundRate: z.number(),
    averageRefundAmount: z.number(),
    refundReasons: z.array(z.object({
      reason: z.string(),
      count: z.number(),
      percentage: z.number(),
    })),
  }),
});

// User Analytics Schema
export const UserAnalyticsSchema = z.object({
  period: z.string(),
  newUsers: z.array(z.object({
    date: z.string(),
    count: z.number(),
  })),
  activeUsers: z.array(z.object({
    date: z.string(),
    count: z.number(),
  })),
  userGrowth: z.object({
    current: z.number(),
    previous: z.number(),
    growthRate: z.number(),
    growthPercentage: z.number(),
  }),
  userRetention: z.object({
    day1: z.number(),
    day7: z.number(),
    day30: z.number(),
    day90: z.number(),
  }),
  userDemographics: z.object({
    byRole: z.array(z.object({
      role: z.enum(['client', 'technician', 'admin']),
      count: z.number(),
      percentage: z.number(),
    })),
    byRegion: z.array(z.object({
      region: z.string(),
      count: z.number(),
      percentage: z.number(),
    })),
    byDevice: z.array(z.object({
      device: z.enum(['mobile', 'tablet', 'desktop']),
      count: z.number(),
      percentage: z.number(),
    })),
  }),
});

// Provider Analytics Schema
export const ProviderAnalyticsSchema = z.object({
  period: z.string(),
  newProviders: z.array(z.object({
    date: z.string(),
    count: z.number(),
  })),
  activeProviders: z.array(z.object({
    date: z.string(),
    count: z.number(),
  })),
  providerGrowth: z.object({
    current: z.number(),
    previous: z.number(),
    growthRate: z.number(),
    growthPercentage: z.number(),
  }),
  providerPerformance: z.object({
    averageRating: z.number(),
    totalReviews: z.number(),
    averageResponseTime: z.number(),
    completionRate: z.number(),
  }),
  topProviders: z.array(z.object({
    id: z.string(),
    name: z.string(),
    revenue: z.number(),
    bookings: z.number(),
    rating: z.number(),
    satisfaction: z.number(),
  })),
});

// Chart Data Schema
export const ChartDataSchema = z.object({
  chartType: z.enum(['line', 'bar', 'area']),
  granularity: z.enum(['daily', 'weekly', 'monthly']),
  data: z.array(z.object({
    label: z.string(),
    revenue: z.number(),
    profit: z.number(),
    bookings: z.number(),
  })),
  chartConfig: z.object({
    xAxis: z.object({
      type: z.string(),
      dataKey: z.string(),
    }),
    yAxis: z.object({
      type: z.string(),
    }),
    series: z.array(z.object({
      name: z.string(),
      dataKey: z.string(),
      color: z.string(),
    })),
  }),
});

// Export all schemas
export const AnalyticsSchemas = {
  dashboardOverview: DashboardOverviewSchema,
  revenueAnalytics: RevenueAnalyticsSchema,
  userAnalytics: UserAnalyticsSchema,
  providerAnalytics: ProviderAnalyticsSchema,
  chartData: ChartDataSchema,
};