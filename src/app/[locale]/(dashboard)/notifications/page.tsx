'use client';

import * as React from 'react';
import { BroadcastNotificationManager } from '@/features/notifications/components/BroadcastNotificationManager';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
        <p className="text-muted-foreground">Manage broadcast messages and automated notification templates.</p>
      </div>

      <Tabs defaultValue="broadcasts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Sent History</TabsTrigger>
        </TabsList>
        <TabsContent value="broadcasts">
          <Card>
            <CardContent className="pt-6">
              <BroadcastNotificationManager />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-lg mt-6">
              Notification Templates placeholder
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-lg mt-6">
              Full Notification History placeholder
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
