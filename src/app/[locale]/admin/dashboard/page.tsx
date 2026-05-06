'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Briefcase, AlertTriangle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';

export default function AdminDashboard() {
    const { data: statsRes, isLoading } = useQuery({
        queryKey: ['adminDashboardStats'],
        queryFn: () => api.getDashboardStats(),
    });

    const stats = statsRes?.data || statsRes || {
        totalUsers: 0,
        activeJobs: 0,
        pendingApplications: 0,
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (stats.totalUsers || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Registered on platform</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (stats.totalJobs || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Active and completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Apps</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (stats.pendingApplications || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Requires review</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full bg-muted/20 rounded flex items-center justify-center text-muted-foreground">
                        {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : "Platform is running smoothly. Chart data available in next update."}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
