'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';

export default function RequestListPage() {
    const queryClient = useQueryClient();

    const { data: availableRes, isLoading } = useQuery({
        queryKey: ['availableJobsList'],
        queryFn: () => api.getAvailableJobs(24.7136, 46.6753, 50), // Mock coordinates
    });

    const acceptJobMutation = useMutation({
        mutationFn: (assignmentId: string) => api.acceptJob(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['availableJobsList'] });
            queryClient.invalidateQueries({ queryKey: ['assignedJobs'] });
        }
    });

    const availableJobs = Array.isArray(availableRes?.data) ? availableRes.data : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Available Job Requests</h1>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : availableJobs.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No available jobs in your area at the moment.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {availableJobs.map((job: any) => (
                        <Card key={job.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-secondary px-2 py-1 rounded text-xs font-medium">
                                                {job.service?.name || 'General'}
                                            </span>
                                            {job.createdAt && (
                                                <span className="text-xs text-muted-foreground">
                                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-semibold">{job.title || 'Service Request'}</h3>
                                        {job.description && (
                                            <p className="text-muted-foreground max-w-2xl text-sm">
                                                {job.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" /> {job.address || 'Address pending'}
                                            </span>
                                            {job.estimatedPrice && (
                                                <span className="flex items-center gap-1 text-primary font-medium">
                                                    Est. ${job.estimatedPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 min-w-[120px] justify-center">
                                        <Button 
                                            onClick={() => acceptJobMutation.mutate(job.id)}
                                            disabled={acceptJobMutation.isPending}
                                        >
                                            {acceptJobMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                            Express Interest
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
