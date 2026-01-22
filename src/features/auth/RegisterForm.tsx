'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

const registerSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    role: z.enum(['client', 'technician']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'client'
        }
    });

    const onSubmit = async (data: RegisterValues) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.push('/login');
        }, 1000);
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Get started with Herfa today</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" {...register('name')} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register('password')} />
                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>I am a...</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer has-[:checked]:border-primary has-[:checked]:text-primary">
                                <input type="radio" value="client" className="accent-primary" {...register('role')} />
                                <span>Client</span>
                            </label>
                            <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer has-[:checked]:border-primary has-[:checked]:text-primary">
                                <input type="radio" value="technician" className="accent-primary" {...register('role')} />
                                <span>Technician</span>
                            </label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
                </p>
            </CardFooter>
        </Card>
    );
}
