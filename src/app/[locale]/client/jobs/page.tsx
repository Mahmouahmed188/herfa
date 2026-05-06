'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';

export default function ClientJobsPage() {
    const { data: response, isLoading } = useQuery({
        queryKey: ['clientJobs'],
        queryFn: () => api.getMyJobs(),
    });

    const jobs = Array.isArray(response) ? response : [];

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
                <Link href="/client/create-job">
                    <Button>New Job</Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : jobs.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">No jobs yet</h2>
                        <p className="text-muted-foreground mb-6">You haven't posted any jobs. Create your first job request now!</p>
                        <Link href="/client/create-job">
                            <Button>Create a Job</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job: any) => (
                        <Card key={job.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                            <div className="flex flex-col md:flex-row">
                                <div className={`w-full md:w-2 bg-primary`} />
                                <div className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                job.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                job.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                                job.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                                                job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                {job.status}
                                            </span>
                                            {job.createdAt && (
                                                <span className="text-xs text-muted-foreground">
                                                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-semibold">{job.service?.name || job.title || 'Service Request'}</h3>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" /> {job.address || 'Address pending'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end justify-center gap-2">
                                        {job.status === 'PENDING' && (
                                            <Button variant="outline" className="text-destructive hover:text-destructive">
                                                Cancel Job
                                            </Button>
                                        )}
                                        <Link href={{ pathname: '/client/jobs/[id]', params: { id: job.id } }} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                                            View Details <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
