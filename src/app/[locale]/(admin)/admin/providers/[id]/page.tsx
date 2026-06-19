'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Store, Star, Shield, Briefcase, DollarSign } from 'lucide-react';
import { Link } from '@/lib/navigation';

export default function ProviderDetailPage() {
  const params = useParams();
  const providerId = params.id as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/providers"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Provider Details</h1>
          <p className="text-sm text-muted-foreground">Provider ID: {providerId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Contact Provider</Button>
          <Button>View Verification</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Rating</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">--</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Services</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">--</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Earnings</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">--</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Status</CardTitle></CardHeader>
          <CardContent><Badge>Pending</Badge></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Provider overview will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Provider services will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Provider reviews will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Verification details will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
