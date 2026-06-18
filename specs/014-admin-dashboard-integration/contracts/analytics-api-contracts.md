# Analytics API Contracts

**Date**: 2026-06-19  
**Feature**: Admin Dashboard Integration  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the API contracts for analytics and reporting functionality. All endpoints follow RESTful conventions and use JSON for request/response bodies.

## Base URL

```
https://api.herfa.com/v1
```

## Common Response Format

### Success Response
```typescript
{
  "success": true,
  "data": T,
  "message": "Operation completed successfully"
}
```

### Error Response
```typescript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

## Analytics APIs

### Dashboard Analytics

#### GET /analytics/dashboard/overview
**Description**: Get platform overview analytics  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `compare`: boolean (default: false) - Compare with previous period

**Response**:
```typescript
{
  "success": true,
  "data": {
    "period": "30d",
    "compare": false,
    "platformOverview": {
      "totalUsers": number,
      "totalCustomers": number,
      "totalProviders": number,
      "activeProviders": number,
      "newUsers": number,
      "newProviders": number,
      "totalBookings": number,
      "completedBookings": number,
      "cancelledBookings": number,
      "totalRevenue": number,
      "growthRate": number
    },
    "businessMetrics": {
      "conversionRate": number,
      "averageOrderValue": number,
      "customerLifetimeValue": number,
      "providerSatisfaction": number,
      "customerSatisfaction": number
    },
    "growthMetrics": {
      "userGrowth": number,
      "providerGrowth": number,
      "bookingGrowth": number,
      "revenueGrowth": number
    },
    "activityMetrics": {
      "dailyActiveUsers": number,
      "dailyActiveProviders": number,
      "peakHours": Array<{
        "hour": number,
        "activity": number
      }>,
      "popularServices": Array<{
        "service": string,
        "count": number
      }>
    }
  }
}
```

### Revenue Analytics

#### GET /analytics/revenue/overview
**Description**: Get revenue overview analytics  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" | "custom" (default: "30d")
- `startDate`: string (ISO 8601, required if period is "custom")
- `endDate`: string (ISO 8601, required if period is "custom")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "period": "30d",
    "totalRevenue": number,
    "averageDailyRevenue": number,
    "revenueTrend": Array<{
      "date": string,
      "revenue": number
    }>,
    "monthlyRevenue": Array<{
      "month": string,
      "revenue": number,
      "growth": number
    }>,
    "revenueByService": Array<{
      "service": string,
      "revenue": number,
      "percentage": number
    }>,
    "revenueByProvider": Array<{
      "provider": string,
      "revenue": number,
      "percentage": number
    }>,
    "refundStatistics": {
      "totalRefunds": number,
      "totalRefundedAmount": number,
      "refundRate": number,
      "averageRefundAmount": number,
      "refundReasons": Array<{
        "reason": string,
        "count": number,
        "percentage": number
      }>
    }
  }
}
```

#### GET /analytics/revenue/charts
**Description**: Get revenue chart data  
**Query Parameters**:
- `chartType`: "line" | "bar" | "area" (default: "line")
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `granularity`: "daily" | "weekly" | "monthly" (default: "daily")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "chartType": "line",
    "granularity": "daily",
    "data": Array<{
      "label": string,
      "revenue": number,
      "profit": number,
      "bookings": number
    }>,
    "chartConfig": {
      "xAxis": {
        "type": "category",
        "dataKey": "label"
      },
      "yAxis": {
        "type": "value"
      },
      "series": [
        {
          "name": "Revenue",
          "dataKey": "revenue",
          "color": "#3B82F6"
        },
        {
          "name": "Profit",
          "dataKey": "profit",
          "color": "#10B981"
        },
        {
          "name": "Bookings",
          "dataKey": "bookings",
          "color": "#F59E0B"
        }
      ]
    }
  }
}
```

### User Analytics

#### GET /analytics/users/overview
**Description**: Get user analytics overview  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "period": "30d",
    "newUsers": Array<{
      "date": string,
      "count": number
    }>,
    "activeUsers": Array<{
      "date": string,
      "count": number
    }>,
    "userGrowth": {
      "current": number,
      "previous": number,
      "growthRate": number,
      "growthPercentage": number
    },
    "userRetention": {
      "day1": number,
      "day7": number,
      "day30": number,
      "day90": number
    },
    "userDemographics": {
      "byRole": Array<{
        "role": "client" | "technician" | "admin",
        "count": number,
        "percentage": number
      }>,
      "byRegion": Array<{
        "region": string,
        "count": number,
        "percentage": number
      }>,
      "byDevice": Array<{
        "device": "mobile" | "tablet" | "desktop",
        "count": number,
        "percentage": number
      }>
    }
  }
}
```

#### GET /analytics/users/behavior
**Description**: Get user behavior analytics  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "userActivity": {
      "dailyActiveUsers": number,
      "weeklyActiveUsers": number,
      "monthlyActiveUsers": number,
      "peakHours": Array<{
        "hour": number,
        "activity": number
      }>
    },
    "userEngagement": {
      "averageSessionDuration": number,
      "pagesPerSession": number,
      "bounceRate": number,
      "conversionRate": number
    },
    "userAcquisition": {
      "acquisitionChannels": Array<{
        "channel": string,
        "count": number,
        "percentage": number
      }>,
      "costPerAcquisition": number
    }
  }
}
```

### Provider Analytics

#### GET /analytics/providers/overview
**Description**: Get provider analytics overview  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
{
  "success": true,
  "data": {
    "period": "30d",
    "newProviders": Array<{
      "date": string,
      "count": number
    }>,
    "activeProviders": Array<{
      "date": string,
      "count": number
    }>,
    "providerGrowth": {
      "current": number,
      "previous": number,
      "growthRate": number,
      "growthPercentage": number
    },
    "providerPerformance": {
      "averageRating": number,
      "totalReviews": number,
      "averageResponseTime": number,
      "completionRate": number
    },
    "topProviders": Array<{
      "id": string,
      "name": string,
      "revenue": number,
      "bookings": number,
      "rating": number,
      "satisfaction": number
    }>
  }
}
```

#### GET /analytics/providers/services
**Description**: Get provider service analytics  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "popularServices": Array<{
      "service": string,
      "providers": number,
      "bookings": number,
      "revenue": number
    }>,
    "servicePerformance": Array<{
      "service": string,
      "averageRating": number,
      "totalBookings": number,
      "completionRate": number,
      "averageResponseTime": number
    }>,
    "serviceTrends": Array<{
      "service": string,
      "period": string,
      "bookings": number,
      "growth": number
    }>
  }
}
```

### Booking Analytics

#### GET /analytics/bookings/overview
**Description**: Get booking analytics overview  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "period": "30d",
    "totalBookings": number,
    "completedBookings": number,
    "cancelledBookings": number,
    "disputedBookings": number,
    "bookingTrend": Array<{
      "date": string,
      "total": number,
      "completed": number,
      "cancelled": number
    }>,
    "bookingStatusDistribution": Array<{
      "status": "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed",
      "count": number,
      "percentage": number
    }>,
    "bookingByService": Array<{
      "service": string,
      "bookings": number,
      "percentage": number
    }>,
    "bookingByRegion": Array<{
      "region": string,
      "bookings": number,
      "percentage": number
    }>
  }
}
```

#### GET /analytics/bookings/conversion
**Description**: Get booking conversion analytics  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "conversionFunnel": Array<{
      "stage": "search" | "view" | "inquiry" | "booking" | "completed",
      "users": number,
      "conversion": number,
      "dropoff": number
    }>,
    "conversionRates": {
      "searchToView": number,
      "viewToInquiry": number,
      "inquiryToBooking": number,
      "bookingToCompleted": number
    },
    "averageConversionTime": number,
    "conversionByDevice": Array<{
      "device": "mobile" | "tablet" | "desktop",
      "conversionRate": number
    }>
  }
}
```

### Review Analytics

#### GET /analytics/reviews/overview
**Description**: Get review analytics overview  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "period": "30d",
    "totalReviews": number,
    "averageRating": number,
    "ratingTrend": Array<{
      "date": string,
      "rating": number,
      "count": number
    }>,
    "ratingDistribution": Array<{
      "rating": 1 | 2 | 3 | 4 | 5,
      "count": number,
      "percentage": number
    }>,
    "reviewSentiment": {
      "positive": number,
      "neutral": number,
      "negative": number
    },
    "reviewByService": Array<{
      "service": string,
      "averageRating": number,
      "totalReviews": number
    }>
  }
}
```

#### GET /analytics/reviews/sentiment
**Description**: Get review sentiment analysis  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "sentimentAnalysis": Array<{
      "date": string,
      "positive": number,
      "neutral": number,
      "negative": number
    }>,
    "commonKeywords": Array<{
      "keyword": string,
      "positive": number,
      "negative": number,
      "total": number
    }>,
    "reviewTopics": Array<{
      "topic": "service" | "provider" | "price" | "communication" | "quality",
      "sentiment": "positive" | "neutral" | "negative",
      "count": number,
      "percentage": number
    }>
  }
}
```

### Support Analytics

#### GET /analytics/support/overview
**Description**: Get support analytics overview  
**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "period": "30d",
    "totalTickets": number,
    "openTickets": number,
    "resolvedTickets": number,
    "averageResolutionTime": number,
    "ticketTrend": Array<{
      "date": string,
      "opened": number,
      "resolved": number,
      "pending": number
    }>,
    "ticketByCategory": Array<{
      "category": "technical" | "billing" | "booking" | "account" | "other",
      "count": number,
      "percentage": number
    }>,
    "ticketByPriority": Array<{
      "priority": "low" | "medium" | "high" | "urgent",
      "count": number,
      "percentage": number
    }>,
    "disputeStatistics": {
      "totalDisputes": number,
      "resolvedDisputes": number,
      "pendingDisputes": number,
      "averageResolutionTime": number,
      "disputeByReason": Array<{
        "reason": "service_quality" | "payment_issue" | "no_show" | "other",
        "count": number,
        "percentage": number
      }>
    }
  }
}
```

#### GET /analytics/support/performance
**Description**: Get support performance metrics  
**Query Parameters**:
- `period": "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response**:
```typescript
{
  "success": true,
  "data": {
    "performanceMetrics": {
      "firstResponseTime": number,
      "resolutionTime": number,
      "customerSatisfaction": number,
      "ticketVolume": number,
      "agentProductivity": number
    },
    "resolutionRates": {
      "overall": number,
      "byCategory": Array<{
        "category": string,
        "rate": number
      }>,
      "byPriority": Array<{
        "priority": string,
        "rate": number
      }>
    },
    "ticketBacklog": Array<{
      "age": string,
      "count": number
    }>
  }
}
```