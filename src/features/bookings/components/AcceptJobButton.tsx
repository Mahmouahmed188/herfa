'use client';

import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useAcceptJob } from '../hooks/useProviderJobActions';

interface AcceptJobButtonProps {
  assignmentId: string;
  onSuccess?: () => void;
}

export function AcceptJobButton({ assignmentId, onSuccess }: AcceptJobButtonProps) {
  const acceptMutation = useAcceptJob();

  const handleAccept = () => {
    acceptMutation.mutate(
      { assignmentId },
      { onSuccess: () => onSuccess?.() }
    );
  };

  return (
    <Button
      onClick={handleAccept}
      disabled={acceptMutation.isPending}
      className="flex items-center gap-2"
    >
      {acceptMutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Check className="w-4 h-4" />
      )}
      Accept
    </Button>
  );
}