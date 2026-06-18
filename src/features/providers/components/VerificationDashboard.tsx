'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, XCircle, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { VerificationStatusBadge } from './VerificationStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface VerificationDashboardProps {
  data: {
    status: string;
    adminNote?: string;
    approvedAt?: string;
    reviewedBy?: string;
    submittedAt: string;
    documents?: Array<{
      id: string;
      type: string;
      url: string;
      status: string;
      rejectionReason?: string;
    }>;
  } | null;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="h-5 w-5 text-amber-500" />,
  UNDER_REVIEW: <AlertTriangle className="h-5 w-5 text-blue-500" />,
  APPROVED: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  REJECTED: <XCircle className="h-5 w-5 text-red-500" />,
  SUSPENDED: <ShieldAlert className="h-5 w-5 text-gray-500" />,
};

const statusSteps = ['PENDING', 'UNDER_REVIEW', 'APPROVED'];

const stepLabelKeys: Record<string, string> = {
  pending: 'pending',
  under_review: 'underReview',
  approved: 'approved',
};

export function VerificationDashboard({ data, isLoading, isError, onRetry }: VerificationDashboardProps) {
  const t = useTranslations('Verification');

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>{t('statusTitle')}</CardTitle></CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
            <div className="h-2 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle>{t('statusTitle')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t('noVerification')}</p>
          <Button asChild>
            <Link href="/provider/verification/submit">{t('startVerification')}</Link>
          </Button>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader><CardTitle>{t('statusTitle')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t('noVerification')}</p>
          <Button asChild>
            <Link href="/provider/verification/submit">{t('startVerification')}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentStepIndex = statusSteps.indexOf(data.status);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('statusTitle')}</CardTitle>
          <VerificationStatusBadge status={data.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Icon and Message */}
        <div className="flex items-center gap-3">
          {statusIcons[data.status]}
          <div>
            <p className="font-medium">
              {data.status}
            </p>
            <p className="text-sm text-muted-foreground">
              Submitted: {new Date(data.submittedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between">
            {statusSteps.map((step, index) => (
              <div
                key={step}
                className={cn(
                  'text-xs font-medium',
                  index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {t(stepLabelKeys[step.toLowerCase()] || step.toLowerCase())}
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                data.status === 'APPROVED' ? 'bg-green-500' :
                data.status === 'REJECTED' || data.status === 'SUSPENDED' ? 'bg-red-500' : 'bg-primary'
              )}
              style={{
                width: currentStepIndex >= 0
                  ? `${((currentStepIndex + 1) / statusSteps.length) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>

        {/* Rejection Details */}
        {data.status === 'REJECTED' && data.adminNote && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <h4 className="font-medium text-red-800 mb-1">{t('rejectReason')}</h4>
            <p className="text-sm text-red-700">{data.adminNote}</p>
          </div>
        )}

        {/* Suspension Details */}
        {data.status === 'SUSPENDED' && data.adminNote && (
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
            <h4 className="font-medium text-gray-800 mb-1">{t('suspended')}</h4>
            <p className="text-sm text-gray-700">{data.adminNote}</p>
          </div>
        )}

        {/* Approval Info */}
        {data.status === 'APPROVED' && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <h4 className="font-medium text-green-800 mb-1">{t('approvalInfo')}</h4>
            {data.reviewedBy && (
              <p className="text-sm text-green-700">
                {t('reviewedBy')}: {data.reviewedBy}
              </p>
            )}
            {data.approvedAt && (
              <p className="text-sm text-green-700">
                {t('approvedAt')}: {new Date(data.approvedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/provider/verification/history">{t('viewHistory')}</Link>
          </Button>
          {data.status === 'REJECTED' && (
            <Button asChild>
              <Link href="/provider/verification/submit">{t('resubmit')}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
