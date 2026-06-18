'use client';

import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { useRejectJob } from '../hooks/useProviderJobActions';

interface RejectJobButtonProps {
  assignmentId: string;
  onSuccess?: () => void;
}

export function RejectJobButton({ assignmentId, onSuccess }: RejectJobButtonProps) {
  const rejectMutation = useRejectJob();

  const handleReject = () => {
    rejectMutation.mutate(
      { assignmentId },
      { onSuccess: () => onSuccess?.() }
    );
  };

  return (
    <Button
      onClick={handleReject}
      disabled={rejectMutation.isPending}
      variant="outline"
      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
    >
      {rejectMutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <X className="w-4 h-4" />
      )}
      Reject
    </Button>
  );
}