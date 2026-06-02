'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useVerificationDetails, useApproveProvider, useRejectProvider } from '@/features/providers/hooks/useVerification';
import { Loading } from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Check, X, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog } from '@/components/ui/feedback/Dialog';
import { FormField } from '@/components/ui/forms/FormField';
import { Input } from '@/components/ui/input';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rejectProviderSchema, RejectProviderInput } from '@/features/providers/schemas/verification';

/**
 * Provider Verification Details Page.
 * Implements the "Verification Workflow" and "Documents Review" requirements.
 */
export default function VerificationDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useVerificationDetails(id);
  const approveMutation = useApproveProvider();
  const rejectMutation = useRejectProvider();
  
  const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false);
  
  const methods = useForm<RejectProviderInput>({
    resolver: zodResolver(rejectProviderSchema),
    defaultValues: {
      providerId: id,
      reason: '',
    },
  });

  if (isLoading) return <Loading fullPage />;
  if (!data?.data) return <div className="p-8 text-center">Provider not found</div>;

  const provider = data.data;

  const handleApprove = () => {
    approveMutation.mutate({ providerId: id });
  };

  const handleReject = (values: RejectProviderInput) => {
    rejectMutation.mutate(values, {
      onSuccess: () => setIsRejectDialogOpen(false),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{provider.providerName}</h1>
          <p className="text-muted-foreground">
            Submitted on {format(new Date(provider.submittedAt), 'PPP')}
          </p>
        </div>
        <Badge variant={provider.status === 'APPROVED' ? 'default' : 'secondary'} className="text-lg px-4 py-1">
          {provider.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {provider.documents.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {doc.type.replace('_', ' ')}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center border-2 border-dashed">
                {/* In a real app, this would be an <img> or <iframe> */}
                <p className="text-sm text-muted-foreground">Document Preview: {doc.url}</p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 py-2 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Status: {doc.status}</span>
              {doc.rejectionReason && (
                <span className="text-xs text-destructive italic">{doc.rejectionReason}</span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {provider.status === 'PENDING' && (
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button
            variant="outline"
            className="gap-2 text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => setIsRejectDialogOpen(true)}
            disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            <X className="w-4 h-4" />
            Reject Provider
          </Button>
          <Button
            className="gap-2"
            onClick={handleApprove}
            disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            <Check className="w-4 h-4" />
            Approve Provider
          </Button>
        </div>
      )}

      <Dialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        title="Reject Provider"
        description="Please provide a reason for rejecting this provider's verification."
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleReject)} className="space-y-4">
            <FormField
              name="reason"
              label="Rejection Reason"
              description="This will be shared with the provider."
            >
              <Input placeholder="Missing identification documents..." />
            </FormField>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={rejectMutation.isPending}>
                Confirm Rejection
              </Button>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
