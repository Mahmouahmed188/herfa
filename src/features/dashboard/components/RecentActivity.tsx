'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'USER_REGISTRATION' | 'PROVIDER_VERIFIED' | 'BOOKING_DISPUTE' | 'PAYOUT_PROCESSED';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

const ICONS: Record<ActivityItem['type'], LucideIcon> = {
  USER_REGISTRATION: UserPlus,
  PROVIDER_VERIFIED: CheckCircle2,
  BOOKING_DISPUTE: AlertCircle,
  PAYOUT_PROCESSED: CreditCard,
};

const COLORS: Record<ActivityItem['type'], string> = {
  USER_REGISTRATION: 'text-blue-500 bg-blue-500/10',
  PROVIDER_VERIFIED: 'text-green-500 bg-green-500/10',
  BOOKING_DISPUTE: 'text-destructive bg-destructive/10',
  PAYOUT_PROCESSED: 'text-orange-500 bg-orange-500/10',
};

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground italic">
              No recent activity to show.
            </div>
          ) : (
            activities.map((item) => {
              const Icon = ICONS[item.type];
              return (
                <div key={item.id} className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-full", COLORS[item.type])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      {item.user && ` • By ${item.user}`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
