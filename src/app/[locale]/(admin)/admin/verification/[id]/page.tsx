'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Shield, CheckCircle2, XCircle, FileText, Clock } from 'lucide-react';
import { useVerificationDetail } from '@/features/verification/hooks/useVerification';
import { useLogAction } from '@/features/audit/hooks/useAudit';
import { Link } from '@/lib/navigation';
import { format } from 'date-fns';

export default function VerificationDetailPage() {
  const params = useParams();
  const verificationId = params.id as string;
  const { data: verification, isLoading } = useVerificationDetail(verificationId);
  const logAction = useLogAction();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="text-center p-12">
        <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">Verification not found</h2>
        <Button variant="outline" asChild>
          <Link href="/admin/verification">Back to Verification</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/verification"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{verification.providerName}</h1>
          <p className="text-sm text-muted-foreground">{verification.providerEmail}</p>
        </div>
        <Badge
          variant={
            verification.status === 'approved' ? 'default' :
            verification.status === 'rejected' ? 'destructive' :
            verification.status === 'suspended' ? 'secondary' :
            'outline'
          }
          className="capitalize"
        >
          {verification.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
          <CardContent>
            {verification.documents && verification.documents.length > 0 ? (
              <div className="space-y-3">
                {verification.documents.map((doc: Record<string, unknown>) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium capitalize">{doc.type}</p>
                        <p className="text-xs text-muted-foreground">{doc.filename}</p>
                      </div>
                    </div>
                    <Badge
                      variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'outline'}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No documents uploaded.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Submitted</span>
              <span>{verification.submittedAt ? format(new Date(verification.submittedAt), 'PPP') : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reviewed</span>
              <span>{verification.reviewedAt ? format(new Date(verification.reviewedAt), 'PPP') : 'Pending'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reviewed By</span>
              <span>{verification.reviewedBy || 'Not assigned'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>History</CardTitle></CardHeader>
        <CardContent>
          {verification.history && verification.history.length > 0 ? (
            <div className="space-y-3">
              {verification.history.map((entry: Record<string, unknown>) => (
                <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-0.5">
                    {entry.action === 'approved' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : entry.action === 'rejected' ? (
                      <XCircle className="w-4 h-4 text-destructive" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{entry.action}</p>
                    {entry.notes && <p className="text-xs text-muted-foreground">{entry.notes}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(entry.timestamp), 'PPP pp')}
                      {entry.adminId && ` by ${entry.adminId}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No history available.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button variant="destructive" onClick={() => logAction.mutate({ action: 'reject_verification', actorType: 'admin', targetType: 'verification', targetId: verificationId })}>
          <XCircle className="w-4 h-4 mr-2" /> Reject
        </Button>
        <Button onClick={() => logAction.mutate({ action: 'approve_verification', actorType: 'admin', targetType: 'verification', targetId: verificationId })}>
          <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
        </Button>
      </div>
    </div>
  );
}
