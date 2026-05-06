'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Star, Briefcase, Loader2, MapPin } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function TechnicianDashboard() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const { data: assignmentsRes, isLoading: isLoadingAssignments } = useQuery({
        queryKey: ['assignedJobs'],
        queryFn: () => api.getAssignedJobs(),
    });

    const { data: availableRes, isLoading: isLoadingAvailable } = useQuery({
        queryKey: ['availableJobs'],
        // Mock coordinates for available jobs. In real app, we'd get from browser geolocation
        queryFn: () => api.getAvailableJobs(24.7136, 46.6753, 50),
    });

    const acceptJobMutation = useMutation({
        mutationFn: (assignmentId: string) => api.acceptJob(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignedJobs'] });
            queryClient.invalidateQueries({ queryKey: ['availableJobs'] });
        }
    });

    const rejectJobMutation = useMutation({
        mutationFn: (assignmentId: string) => api.rejectJob(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignedJobs'] });
        }
    });

    const assignedJobs = Array.isArray(assignmentsRes?.data) ? assignmentsRes.data : [];
    const availableJobs = Array.isArray(availableRes?.data) ? availableRes.data : [];

    const activeCount = assignedJobs.filter((job: any) => job.status === 'ACCEPTED' || job.status === 'IN_PROGRESS').length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Technician Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground">0 completed jobs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoadingAssignments ? <Loader2 className="w-5 h-5 animate-spin" /> : activeCount}
                        </div>
                        <p className="text-xs text-muted-foreground">Currently in progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5.0</div>
                        <p className="text-xs text-muted-foreground">New provider</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Assigned Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoadingAssignments ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : assignedJobs.length > 0 ? (
                                assignedJobs.map((assignment: any) => (
                                    <div key={assignment.id} className="border rounded-lg p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold">{assignment.job?.service?.name || assignment.job?.title || 'Service Request'}</h4>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {assignment.job?.address || 'Address pending'}
                                                </p>
                                                {assignment.job?.estimatedPrice && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Est. ${assignment.job.estimatedPrice}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-xs font-semibold px-2 py-1 rounded bg-secondary text-secondary-foreground">
                                                {assignment.status}
                                            </span>
                                        </div>
                                        
                                        {assignment.status === 'PENDING' && (
                                            <div className="flex gap-2 mt-2">
                                                <button 
                                                    onClick={() => rejectJobMutation.mutate(assignment.id)}
                                                    disabled={rejectJobMutation.isPending}
                                                    className="text-sm font-medium text-destructive px-3 py-1 border border-destructive/20 rounded hover:bg-destructive/10 disabled:opacity-50"
                                                >
                                                    Decline
                                                </button>
                                                <button 
                                                    onClick={() => acceptJobMutation.mutate(assignment.id)}
                                                    disabled={acceptJobMutation.isPending}
                                                    className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded hover:bg-primary/20 disabled:opacity-50"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No assigned jobs yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Available Nearby</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoadingAvailable ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : availableJobs.length > 0 ? (
                                availableJobs.map((job: any) => (
                                    <div key={job.id} className="border rounded-lg p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold">{job.service?.name || job.title || 'Service Request'}</h4>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {job.address || 'Address pending'}
                                                </p>
                                            </div>
                                            {job.estimatedPrice && (
                                                <span className="text-sm font-bold text-primary">
                                                    ${job.estimatedPrice}
                                                </span>
                                            )}
                                        </div>
                                        <button className="text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded mt-2 hover:bg-primary/20 w-full">
                                            Express Interest
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No available jobs nearby.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
