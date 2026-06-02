'use client';

import * as React from 'react';
import { CategoryManagement } from '@/features/cms/components/CategoryManagement';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CMSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">Manage service categories, banners, and static page content.</p>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="pages">Static Pages</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <Card>
            <CardContent className="pt-6">
              <CategoryManagement />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="banners">
          <Card>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-lg mt-6">
              Banner Management placeholder
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pages">
          <Card>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-lg mt-6">
              Static Pages placeholder
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
