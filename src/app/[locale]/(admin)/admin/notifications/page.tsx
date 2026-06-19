'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Megaphone, AlertTriangle, Info, CheckCheck } from 'lucide-react';

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Notifications Center</h1>
        <div className="flex gap-2">
          <Button variant="outline"><CheckCheck className="w-4 h-4 mr-2" /> Mark All Read</Button>
          <Button><Megaphone className="w-4 h-4 mr-2" /> New Announcement</Button>
        </div>
      </div>

      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts"><AlertTriangle className="w-4 h-4 mr-2" /> Alerts</TabsTrigger>
          <TabsTrigger value="announcements"><Megaphone className="w-4 h-4 mr-2" /> Announcements</TabsTrigger>
          <TabsTrigger value="system"><Info className="w-4 h-4 mr-2" /> System</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Alert notifications will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Announcements will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>System notifications will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
