'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import * as api from '@/services/api';
import { bookingApi } from '@/features/bookings/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAddresses } from '@/features/addresses/hooks/useAddresses';
import { Address } from '@/features/addresses/types';

const createJobSchema = z.object({
    categoryId: z.string().min(1, "Please select a service"),
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    address: z.string().optional(),
    addressId: z.string().optional(),
});

type CreateJobValues = z.infer<typeof createJobSchema>;

export function CreateJobForm() {
    const router = useRouter();
    const [selectedService, setSelectedService] = React.useState<string | null>(null);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateJobValues>({
        resolver: zodResolver(createJobSchema),
    });

    const { data: servicesRes, isLoading: loadingServices } = useQuery({
        queryKey: ['services'],
        queryFn: () => api.getServices(),
    });

    const { data: addressesData, isLoading: loadingAddresses } = useAddresses();
    const rawAddr = addressesData as { data?: Address[] } | Address[] | undefined;
    const addresses: Address[] = Array.isArray(rawAddr) ? rawAddr : rawAddr?.data ?? [];

    const selectedAddressId = watch('addressId');
    const selectedAddress = addresses.find((a: Address) => a.id === selectedAddressId);

    const createJobMutation = useMutation({
        mutationFn: (data: CreateJobValues) => bookingApi.createJob({
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            latitude: selectedAddress?.latitude ?? 0,
            longitude: selectedAddress?.longitude ?? 0,
            address: selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.area}, ${selectedAddress.city}`
                : data.address || '',
        }),
        onSuccess: () => {
            router.push('/client/dashboard');
        },
        onError: (error: Error) => {
            setSubmitError(error.message || 'Failed to create job');
        }
    });

    const onSubmit = (data: CreateJobValues) => {
        setSubmitError(null);
        createJobMutation.mutate(data);
    };

    const handleSelectService = (id: string) => {
        setSelectedService(id);
        setValue('categoryId', id, { shouldValidate: true });
    }

    const servicesData = servicesRes as { data?: Array<{ id: string; name: string; description?: string }> } | Array<{ id: string; name: string; description?: string }> | undefined;
    const services = Array.isArray(servicesData) ? servicesData : servicesData?.data ?? [];

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Post a New Job</CardTitle>
                <CardDescription>Describe your issue and we&apos;ll match you with the best technicians.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    <div className="space-y-4">
                        <Label className="text-base">1. Select Service Type</Label>
                        {loadingServices ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => handleSelectService(service.id)}
                                        className={cn(
                                            "cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2 transition-all hover:border-primary",
                                            selectedService === service.id ? "border-primary bg-primary/10" : "bg-card"
                                        )}
                                    >
                                        <div className="font-semibold">{service.name}</div>
                                        {service.description && (
                                            <div className="text-xs text-muted-foreground line-clamp-2">{service.description}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="title" className="text-base">2. Job Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Kitchen Sink Repair"
                            {...register('title')}
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="description" className="text-base">3. Describe the Issue</Label>
                        <textarea
                            id="description"
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                            placeholder="Please describe the problem in detail..."
                            {...register('description')}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label className="text-base">4. Location</Label>
                        {loadingAddresses ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : addresses.length > 0 ? (
                            <div className="space-y-2">
                                {addresses.map((addr: Address) => (
                                    <label
                                        key={addr.id}
                                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                                            selectedAddressId === addr.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-slate-200 dark:border-surface-border hover:border-primary/50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            {...register('addressId')}
                                            value={addr.id}
                                            className="mt-1"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-sm text-slate-900 dark:text-white">{addr.label}</p>
                                                {addr.isDefault && (
                                                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Default</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                                                {addr.street}, {addr.area}, {addr.city}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Or type a new address"
                                        className="pl-10"
                                        {...register('address')}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="address" placeholder="Search for your address" className="pl-10" {...register('address')} />
                            </div>
                        )}
                        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                    </div>

                    {submitError && (
                        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                            {submitError}
                        </div>
                    )}

                    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={createJobMutation.isPending}>
                        {createJobMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Job Request
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
