'use client';

import { Button } from '@/components/ui/button';
import { Flag, Loader2 } from 'lucide-react';
import { useUpdateJobStatus } from '../hooks/useProviderJobActions';

interface CompleteJobButtonProps {
  jobId: string;
  onSuccess?: () => void;
}

export function CompleteJobButton({ jobId, onSuccess }: CompleteJobButtonProps) {
  const updateMutation = useUpdateJobStatus();

  const handleComplete = () => {
    updateMutation.mutate(
      { id: jobId, status: 'COMPLETED' },
      { onSuccess: () => onSuccess?.() }
    );
  };

  return (
    <Button
      onClick={handleComplete}
      disabled={updateMutation.isPending}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
    >
      {updateMutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Flag className="w-4 h-4" />
      )}
      Mark Complete
    </Button>
  );
}