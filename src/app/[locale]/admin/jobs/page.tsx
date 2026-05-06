'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Briefcase, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';

export default function AdminJobsPage() {
    const { data: response, isLoading } = useQuery({
        queryKey: ['adminJobs'],
        queryFn: () => api.getAllJobs(),
    });

    const jobs = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Platform Jobs</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Filter</Button>
                    <Button>Export Data</Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : jobs.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Briefcase className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">No jobs found</h2>
                        <p className="text-muted-foreground">The platform currently has no active or completed jobs.</p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>All Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Job ID & Details</th>
                                        <th className="px-6 py-3 font-semibold">Client</th>
                                        <th className="px-6 py-3 font-semibold">Provider</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold">Date</th>
                                        <th className="px-6 py-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job: any) => (
                                        <tr key={job.id} className="border-b hover:bg-muted/20">
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-primary">{job.service?.name || job.title || 'Service Request'}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <span className="font-mono">{job.id.substring(0, 8)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="truncate max-w-[150px]">{job.address || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{job.customer?.name || 'Unknown'}</div>
                                                {job.customer?.email && <div className="text-xs text-muted-foreground">{job.customer.email}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {job.provider ? (
                                                    <div>
                                                        <div className="font-medium">{job.provider.name}</div>
                                                        <div className="text-xs text-muted-foreground">{job.provider.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                    job.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                                    job.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                                    job.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                                                    job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap mt-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {job.createdAt ? new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary">
                                                    Manage <ArrowRight className="w-3 h-3 ml-1" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
