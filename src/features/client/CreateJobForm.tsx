'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { mockServices } from '@/services/mock/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const createJobSchema = z.object({
    serviceId: z.string().min(1, "Please select a service"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(1, "Location is required"),
});

type CreateJobValues = z.infer<typeof createJobSchema>;

export function CreateJobForm() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [selectedService, setSelectedService] = React.useState<string | null>(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateJobValues>({
        resolver: zodResolver(createJobSchema),
    });

    const onSubmit = async (data: CreateJobValues) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.push('/client/dashboard');
        }, 1500);
    };

    const handleSelectService = (id: string) => {
        setSelectedService(id);
        setValue('serviceId', id, { shouldValidate: true });
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Post a New Job</CardTitle>
                <CardDescription>Describe your issue and we'll match you with the best technicians.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    <div className="space-y-4">
                        <Label className="text-base">1. Select Service Type</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {mockServices.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => handleSelectService(service.id)}
                                    className={cn(
                                        "cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition-all hover:border-primary",
                                        selectedService === service.id ? "border-primary bg-primary/10" : "bg-card"
                                    )}
                                >
                                    {/* Icons are purely decorative here, using text name fallback if icon component not available directly in this scope easily without dynamic mapping */}
                                    <div className="font-semibold">{service.name}</div>
                                    <div className="text-xs text-muted-foreground text-center">{service.description}</div>
                                </div>
                            ))}
                        </div>
                        {errors.serviceId && <p className="text-sm text-destructive">{errors.serviceId.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="description" className="text-base">2. Describe the Issue</Label>
                        <textarea
                            id="description"
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                            placeholder="Please describe the problem in detail..."
                            {...register('description')}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="location" className="text-base">3. Location</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="location" placeholder="Search for your address" className="pl-10" {...register('location')} />
                        </div>
                        {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}

                        {/* Map Placeholder */}
                        <div className="w-full h-48 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
                            <p className="text-muted-foreground flex items-center gap-2">
                                <MapPin className="h-5 w-5" /> Map View Mockup
                            </p>
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Job Request
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
