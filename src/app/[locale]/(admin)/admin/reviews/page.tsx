'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, Eye, EyeOff } from 'lucide-react';

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = React.useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Review Moderation</h1>
        <Button>Export Reviews</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search reviews..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'VISIBLE', 'HIDDEN'].map((f) => (
            <Button key={f} variant={f === 'ALL' ? 'default' : 'outline'} size="sm">{f}</Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="pending">Pending Moderation</TabsTrigger>
          <TabsTrigger value="hidden">Hidden</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>All reviews will be displayed here with moderation actions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Reviews awaiting moderation will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hidden">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <EyeOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Hidden/moderated reviews will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
