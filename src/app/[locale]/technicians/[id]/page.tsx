'use client';

import React from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { providerApi } from '@/features/providers/services/api';

export default function TechnicianProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['providers', 'verification', id],
    queryFn: () => providerApi.getVerificationDetails(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const technician = data?.success ? data.data : null;

  if (isError || !technician) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <Link href="/technicians" className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400 hover:text-primary transition-colors text-sm font-medium mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Technicians
          </Link>
          <div className="text-center py-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Technician not found</h2>
            <p className="text-slate-500 dark:text-gray-400">The requested technician profile is not available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-surface-border">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
          <Link href="/technicians" className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400 hover:text-primary transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Technicians
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="text-center py-24">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{technician.providerName}</h2>
          <p className="text-slate-500 dark:text-gray-400">Technician profile details coming soon.</p>
        </div>
      </div>
    </div>
  );
}
