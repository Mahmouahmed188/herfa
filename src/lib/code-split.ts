import dynamic from 'next/dynamic';
import { Loading } from '@/components/common/Loading';

export function createLazyComponent<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  loadingMessage = 'Loading...'
) {
  return dynamic(importFn, {
    loading: () => <Loading fullPage />,
  });
}

export const LazyAnalyticsOverview = createLazyComponent(
  () => import('@/features/analytics/components/AnalyticsOverview')
);

export const LazyConversionFunnel = createLazyComponent(
  () => import('@/features/analytics/components/ConversionFunnel')
);

export const LazyRetentionChart = createLazyComponent(
  () => import('@/features/analytics/components/RetentionChart')
);

export const LazySupportTicketList = createLazyComponent(
  () => import('@/features/support/components/SupportTicketList')
);

export const LazyReviewModerator = createLazyComponent(
  () => import('@/features/support/components/ReviewModerator')
);

export const LazyBannerManager = createLazyComponent(
  () => import('@/features/cms/components/BannerManager')
);

export const LazyTemplateEditor = createLazyComponent(
  () => import('@/features/notifications/components/TemplateEditor')
);
