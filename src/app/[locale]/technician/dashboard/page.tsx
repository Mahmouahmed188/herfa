'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Star, Briefcase } from 'lucide-react';

export default function TechnicianDashboard() {
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
                        <div className="text-2xl font-bold">$4,325.00</div>
                        <p className="text-xs text-muted-foreground">+15% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Currently in progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.9</div>
                        <p className="text-xs text-muted-foreground">Based on 124 reviews</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Job Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Mock Requests */}
                        <div className="border rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold">Plumbing Fix needed</h4>
                                <p className="text-sm text-muted-foreground">Downtown Area • $50-$100 est.</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-sm font-medium text-destructive">Decline</button>
                                <button className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded">Accept</button>
                            </div>
                        </div>
                        <div className="border rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold">Leak Repair</h4>
                                <p className="text-sm text-muted-foreground">Uptown • $80 est.</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded">Accept</button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
