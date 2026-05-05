'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { useRouter } from 'next/navigation';
import { Link, useRouter } from "@/lib/navigation";
import * as api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, Eye, EyeOff, Mail, Lock, User, Wrench, HardHat } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
    role: z.enum(['client', 'technician']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'client' },
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: RegisterValues) => {
        setLoading(true);
        setError('');
        try {
            const result = await api.register({
                email: data.email,
                password: data.password,
                role: data.role // Send role to backend if needed
            });

            if (result.token) {
                router.push('/login');
            } else {
                setError(result.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Connection error. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm">Get started with Herfa today</p>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <label className="relative cursor-pointer">
                    <input type="radio" value="client" {...register('role')} className="sr-only peer" />
                    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedRole === 'client' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-surface-border hover:border-primary/40'}`}>
                        <User className={`w-6 h-6 ${selectedRole === 'client' ? 'text-primary' : 'text-slate-400'}`} />
                        <span className={`text-sm font-semibold ${selectedRole === 'client' ? 'text-primary' : 'text-slate-600 dark:text-gray-400'}`}>
                            Client
                        </span>
                        <span className="text-xs text-slate-400 dark:text-gray-500 text-center">I need services</span>
                    </div>
                </label>
                <label className="relative cursor-pointer">
                    <input type="radio" value="technician" {...register('role')} className="sr-only peer" />
                    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedRole === 'technician' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-surface-border hover:border-primary/40'}`}>
                        <HardHat className={`w-6 h-6 ${selectedRole === 'technician' ? 'text-primary' : 'text-slate-400'}`} />
                        <span className={`text-sm font-semibold ${selectedRole === 'technician' ? 'text-primary' : 'text-slate-600 dark:text-gray-400'}`}>
                            Technician
                        </span>
                        <span className="text-xs text-slate-400 dark:text-gray-500 text-center">I offer services</span>
                    </div>
                </label>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="name"
                            {...register('name')}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        />
                    </div>
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="confirmPassword"
                            type={showConfirm ? 'text' : 'password'}
                            {...register('confirmPassword')}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-surface-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-background-light dark:bg-background-dark text-slate-500 dark:text-gray-500">
                        Already have an account?
                    </span>
                </div>
            </div>

            <Link
                href="/login"
                className="w-full flex items-center justify-center py-3 px-6 rounded-xl border border-slate-200 dark:border-surface-border text-slate-700 dark:text-gray-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-surface-dark transition-all"
            >
                Sign In
            </Link>

            <p className="text-center text-xs text-slate-400 dark:text-gray-600 mt-6">
                © 2024 Herfa Inc. &nbsp;·&nbsp;{' '}
                <Link href="#" className="hover:underline">Privacy</Link>
                &nbsp;·&nbsp;
                <Link href="#" className="hover:underline">Terms</Link>
            </p>
        </div>
    );
}
