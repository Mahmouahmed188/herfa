'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from 'lucide-react'; // Badge icon, assuming Badge component is not installed yet or I should use div

export default function ComplaintsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>

            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground py-8">
                        No active complaints.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
