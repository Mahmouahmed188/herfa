'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';

export default function RequestListPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Job Requests</h1>

            <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-secondary px-2 py-1 rounded text-xs font-medium">Plumbing</span>
                                        <span className="text-xs text-muted-foreground">Posted 10 mins ago</span>
                                    </div>
                                    <h3 className="text-xl font-semibold">Kitchen Sink Leaking Badly</h3>
                                    <p className="text-muted-foreground max-w-2xl">
                                        The pipe under the sink has burst and water is flooding the floor. Need urgent help.
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> 123 Main St, Downtown</span>
                                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> ASAP</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 min-w-[120px]">
                                    <Button>Accept Job</Button>
                                    <Button variant="outline" className="text-destructive hover:text-destructive">Decline</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
