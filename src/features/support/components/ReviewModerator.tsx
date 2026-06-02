'use client';

import * as React from 'react';
import { useReviews, useModerateReview } from '../hooks/useSupport';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReviewItem } from '../services/api';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Flag, Star } from 'lucide-react';

export function ReviewModerator() {
  const { data, isLoading } = useReviews({ status: 'PENDING' });
  const moderateReview = useModerateReview();

  const columns = [
    {
      header: 'Reviewer',
      accessorKey: 'reviewer',
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      cell: (row: ReviewItem) => (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{row.rating}</span>
        </div>
      ),
    },
    {
      header: 'Comment',
      accessorKey: 'comment',
      cell: (row: ReviewItem) => (
        <span className="text-sm line-clamp-2 max-w-[300px]">{row.comment}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: ReviewItem) => (
        <Badge variant={row.status === 'PENDING' ? 'outline' : row.status === 'APPROVED' ? 'default' : 'destructive'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: (row: ReviewItem) => format(new Date(row.createdAt), 'PP'),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: ReviewItem) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-green-500"
            onClick={() => moderateReview.mutate({ id: row.id, action: 'APPROVED' })}
          >
            <CheckCircle2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => moderateReview.mutate({ id: row.id, action: 'REJECTED' })}
          >
            <XCircle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-orange-500"
            onClick={() => moderateReview.mutate({ id: row.id, action: 'FLAGGED' })}
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Review Moderation</h2>
      <DataTable data={data?.data || []} columns={columns} isLoading={isLoading} />
    </div>
  );
}

export default ReviewModerator;
