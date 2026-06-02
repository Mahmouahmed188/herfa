'use client';

import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/navigation';

export function AccessDenied() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        You do not have the necessary permissions to view this section of the admin dashboard. 
        Please contact a super admin if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Button onClick={() => router.push('/admin/dashboard' as any)} className="gap-2">
          <Home className="w-4 h-4" />
          Dashboard Home
        </Button>
      </div>
    </div>
  );
}
