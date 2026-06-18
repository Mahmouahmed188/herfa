'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useUpdateJobStatus } from '../hooks/useProviderJobActions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatusUpdateSelectProps {
  jobId: string;
  currentStatus: string;
  onSuccess?: () => void;
}

const statusProgression: Record<string, string[]> = {
  ACCEPTED: ['ON_THE_WAY'],
  ON_THE_WAY: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
};

export function StatusUpdateSelect({ jobId, currentStatus, onSuccess }: StatusUpdateSelectProps) {
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const updateMutation = useUpdateJobStatus();

  const nextStatuses = statusProgression[currentStatus] || [];

  const handleUpdate = () => {
    if (!selectedStatus) return;
    updateMutation.mutate(
      { id: jobId, status: selectedStatus as any },
      {
        onSuccess: () => {
          setSelectedStatus('');
          onSuccess?.();
        },
      }
    );
  };

  if (nextStatuses.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          {nextStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdate}
        disabled={!selectedStatus || updateMutation.isPending}
        size="sm"
      >
        {updateMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Update'
        )}
      </Button>
    </div>
  );
}