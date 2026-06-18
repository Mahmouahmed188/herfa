'use client';

import * as React from 'react';
import { Loader2, Clock } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingCard } from '@/features/bookings/components/BookingCard';
import { BookingFilters } from '@/features/bookings/components/BookingFilters';
import { BookingPagination } from '@/features/bookings/components/BookingPagination';
import { useCustomerBookings } from '@/features/bookings/hooks/useCustomerBookings';
import { BookingStatus } from '@/features/bookings/types';

export default function ClientJobsPage() {
  const [status, setStatus] = React.useState<BookingStatus | 'ALL'>('ALL');
  const [sort, setSort] = React.useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading } = useCustomerBookings({ status, sort, page, limit });
  const jobs = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  React.useEffect(() => {
    setPage(1);
  }, [status, sort]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <Link href="/client/create-job">
          <Button>New Job</Button>
        </Link>
      </div>

      <BookingFilters
        status={status}
        sort={sort}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">No jobs yet</h2>
            <p className="text-muted-foreground mb-6">You haven&apos;t posted any jobs. Create your first job request now!</p>
            <Link href="/client/create-job">
              <Button>Create a Job</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {jobs.map((job) => (
              <BookingCard key={job.id} booking={job} />
            ))}
          </div>
          <BookingPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
