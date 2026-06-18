'use client';

import * as React from 'react';
import { XCircle, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCancelBooking } from '../hooks/useCancelBooking';

const cancellationReasons = [
  'Changed my mind',
  'Found another provider',
  'Scheduling conflict',
  'Service no longer needed',
  'Price too high',
  'Other',
];

interface CancelBookingDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CancelBookingDialog({ bookingId, open, onOpenChange, onSuccess }: CancelBookingDialogProps) {
  const [step, setStep] = React.useState<'reason' | 'confirm'>('reason');
  const [selectedReason, setSelectedReason] = React.useState('');
  const [customReason, setCustomReason] = React.useState('');
  const [error, setError] = React.useState('');

  const cancelMutation = useCancelBooking(bookingId);

  React.useEffect(() => {
    if (!open) {
      setStep('reason');
      setSelectedReason('');
      setCustomReason('');
      setError('');
    }
  }, [open]);

  const handleNext = () => {
    if (!selectedReason) {
      setError('Please select a cancellation reason');
      return;
    }
    setError('');
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setError('');
    const reason = selectedReason === 'Other' ? customReason : selectedReason;
    try {
      await cancelMutation.mutateAsync(reason || undefined);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.error?.message || err?.message || 'Failed to cancel booking');
    }
  };

  return (
      <Dialog open={open} onOpenChange={(val: boolean) => { if (!cancelMutation.isPending) onOpenChange(val); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" /> Cancel Booking
          </DialogTitle>
          <DialogDescription>
            {step === 'reason'
              ? 'Please tell us why you are cancelling this booking.'
              : 'Are you sure you want to cancel this booking? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'reason' && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              {cancellationReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950'
                      : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="text-red-600"
                  />
                  <span className="text-sm font-medium">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="customReason">Please specify</Label>
                <Input
                  id="customReason"
                  placeholder="Enter your reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {step === 'confirm' && (
          <div className="py-2 space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Reason:</span>
                <span className="font-medium">{selectedReason === 'Other' ? customReason : selectedReason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking ID:</span>
                <span className="font-mono text-xs">#{bookingId.slice(0, 8)}</span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step === 'reason' ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Go Back</Button>
              <Button variant="destructive" onClick={handleNext} disabled={!selectedReason}>
                Next: Confirm
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep('reason')} disabled={cancelMutation.isPending}>
                Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}