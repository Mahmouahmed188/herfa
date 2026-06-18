# Quick Start: Admin Dashboard Integration

**Date**: 2026-06-19  
**Feature**: Admin Dashboard Integration  
**Phase**: 1 - Design & Contracts

## Overview

This quick start guide provides essential information for implementing the Admin Dashboard Integration feature. The implementation follows the established patterns and principles defined in the Herfa Frontend Constitution.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Access to the Herfa backend API
- Existing Herfa frontend project structure

## Setup Instructions

### 1. Environment Configuration

Add the following environment variables to your `.env.local` file:

```bash
# Admin Dashboard API endpoints
NEXT_PUBLIC_API_BASE_URL=https://api.herfa.com/v1
NEXT_PUBLIC_ADMIN_DASHBOARD_URL=/admin

# Authentication
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_ADMIN_ROLES=super_admin,admin,support_admin

# Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_REAL_TIME_UPDATES=true

# File uploads
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Directory Structure

Create the following directory structure under `src/features/`:

```
src/features/
├── analytics/          # Analytics services and components
├── dashboard/          # Dashboard widgets and KPI components
├── finance/            # Payment and refund management
├── notifications/      # Notification center
├── providers/          # Provider management
├── reviews/            # Review moderation
├── support/            # Support and dispute management
├── users/              # User management
└── verification/       # Verification workflow
```

### 4. Route Setup

Add the following routes to `src/app/[locale]/(admin)/`:

```
src/app/[locale]/(admin)/
├── dashboard/           # Dashboard overview
├── users/              # User management
├── providers/          # Provider management
├── analytics/          # Analytics and reporting
├── support/            # Support and disputes
├── finance/            # Payments and refunds
├── verification/       # Verification queue
├── reviews/            # Review moderation
├── audit/              # Activity logs
├── notifications/     # Notifications center
└── settings/           # Admin settings
```

## Implementation Steps

### Step 1: Create API Services

Create service files for each domain:

```typescript
// src/features/analytics/services/api.ts
import { api } from '@/lib/api';

export const analyticsApi = {
  getDashboardOverview: (period?: string) => 
    api.get('/analytics/dashboard/overview', { params: { period } }),
  
  getRevenueOverview: (period?: string) => 
    api.get('/analytics/revenue/overview', { params: { period } }),
  
  getUserAnalytics: (period?: string) => 
    api.get('/analytics/users/overview', { params: { period } }),
  
  getProviderAnalytics: (period?: string) => 
    api.get('/analytics/providers/overview', { params: { period } }),
};
```

### Step 2: Create TanStack Query Hooks

Create hooks for data fetching:

```typescript
// src/features/analytics/hooks/useDashboardAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../services/api';

export const useDashboardAnalytics = (period?: string) => {
  return useQuery({
    queryKey: ['dashboard', 'overview', period],
    queryFn: () => analyticsApi.getDashboardOverview(period),
    select: (response) => response.data,
  });
};
```

### Step 3: Create Components

Create reusable components for the admin dashboard:

```typescript
// src/components/ui/data-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface DataTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any) => React.ReactNode;
  }[];
  onRowClick?: (row: any) => void;
}

export function DataTable({ data, columns, onRowClick }: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow 
            key={index} 
            className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.render ? column.render(row[column.key]) : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Step 4: Create Dashboard Layout

Create the main dashboard layout:

```typescript
// src/app/[locale]/(admin)/dashboard/page.tsx
import { DashboardOverview } from '@/features/dashboard/components/DashboardOverview';
import { DashboardKPIs } from '@/features/dashboard/components/DashboardKPIs';
import { RecentActivity } from '@/features/dashboard/components/RecentActivity';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>
      
      <DashboardKPIs />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardOverview />
        <RecentActivity />
      </div>
    </div>
  );
}
```

### Step 5: Implement Authentication

Create authentication guards:

```typescript
// src/components/auth/PermissionGuard.tsx
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PermissionGuardProps {
  permissions?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ 
  permissions = [], 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || (permissions.length > 0 && !permissions.some(p => user.permissions?.includes(p))))) {
      router.push('/admin/login');
    }
  }, [user, isLoading, permissions, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || (permissions.length > 0 && !permissions.some(p => user.permissions?.includes(p)))) {
    return fallback;
  }

  return <>{children}</>;
}
```

### Step 6: Error Handling

Implement error boundaries and error handling:

```typescript
// src/components/common/ErrorBoundary.tsx
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      fallback={
        <Alert variant="destructive">
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      }
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

## Key Implementation Patterns

### 1. API Integration Pattern

```typescript
// Always use TanStack Query for server state
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['users'],
  queryFn: usersApi.getUsers,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Handle loading states
if (isLoading) return <Skeleton className="h-32" />;

// Handle error states
if (error) return <ErrorAlert message={error.message} />;

// Render data
return <DataTable data={data} columns={columns} />;
```

### 2. Permission Guard Pattern

```typescript
// Protect routes and components
<PermissionGuard permissions={['users.read']}>
  <UsersTable />
</PermissionGuard>

// Protect actions
<PermissionGuard permissions={['users.suspend']}>
  <Button onClick={suspendUser}>Suspend User</Button>
</PermissionGuard>
```

### 3. Form Validation Pattern

```typescript
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['client', 'technician', 'admin']),
});

export function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Name"
        error={errors.name?.message}
        {...register('name')}
      />
      <FormField
        label="Email"
        error={errors.email?.message}
        {...register('email')}
      />
      <FormField
        label="Role"
        error={errors.role?.message}
        {...register('role')}
      />
      <Button type="submit">Save User</Button>
    </form>
  );
}
```

## Testing

### Unit Tests

```typescript
// tests/unit/features/analytics/hooks/useDashboardAnalytics.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardAnalytics } from '@/features/analytics/hooks/useDashboardAnalytics';
import { mockAnalyticsApi } from '@/__mocks__/analyticsApi';

jest.mock('@/features/analytics/services/api');

describe('useDashboardAnalytics', () => {
  it('should fetch dashboard analytics data', async () => {
    mockAnalyticsApi.getDashboardOverview.mockResolvedValue({
      data: { totalUsers: 1000 },
    });

    const { result } = renderHook(() => useDashboardAnalytics());

    await waitFor(() => {
      expect(result.current.data).toEqual({ totalUsers: 1000 });
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/admin/dashboard.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardPage } from '@/app/[locale]/(admin)/dashboard/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Dashboard Page', () => {
  it('should render dashboard components', async () => {
    render(<DashboardPage />);

    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
  });
});
```

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Run Linting

```bash
npm run lint
```

### 3. Run Type Checking

```bash
npm run type-check
```

### 4. Run Tests

```bash
npm run test
```

### 5. Build for Production

```bash
npm run build
```

## Common Issues and Solutions

### 1. API Integration Issues

**Problem**: API calls failing with 401 errors
**Solution**: Check authentication token and ensure proper permission guards are in place

### 2. Performance Issues

**Problem**: Dashboard loading slowly with large datasets
**Solution**: Implement server-side pagination and use TanStack Query caching

### 3. RTL Layout Issues

**Problem**: Arabic text not displaying correctly
**Solution**: Ensure all text uses `next-intl` and CSS properties use logical values

### 4. Permission Issues

**Problem**: Users accessing restricted areas
**Solution**: Verify permission guards are implemented at route and component levels

## Next Steps

1. Review the complete [data model](./data-model.md)
2. Study the [API contracts](./contracts/)
3. Follow the generated [tasks](./tasks.md) for detailed implementation steps
4. Test thoroughly with the provided test suites

## Support

For questions or issues:
- Review the [Herfa Frontend Constitution](/.specify/memory/constitution.md)
- Check existing patterns in the codebase
- Consult with the development team