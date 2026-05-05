'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useRouter } from "@/lib/navigation";
import * as api from '@/services/api';
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone, HardHat } from 'lucide-react';

const registerSchema = z.object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    role: z.enum(['customer', 'provider']),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'customer',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
        },
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: RegisterValues) => {
        setLoading(true);
        setError('');
        try {
            const result = await api.register({
                email: data.email,
                phone: data.phone,
                password: data.password,
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName,
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
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm">Get started with Herfa today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Role Toggle */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Account Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setValue('role', 'customer', { shouldValidate: true })}
                            className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all ${selectedRole === 'customer'
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 dark:border-surface-border hover:border-primary/40'
                                }`}
                        >
                            <User className={`w-6 h-6 ${selectedRole === 'customer' ? 'text-primary' : 'text-slate-400'}`} />

                            <span className={`text-sm font-semibold ${selectedRole === 'customer' ? 'text-primary' : 'text-slate-600 dark:text-gray-400'}`}>
                                Customer
                            </span>
                            <span className="text-xs text-slate-400 dark:text-gray-500">I need services</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue('role', 'provider', { shouldValidate: true })}
                            className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all ${selectedRole === 'provider'
                                ? 'border-primary bg-primary/5'
                                : 'border-slate-200 dark:border-surface-border hover:border-primary/40'
                                }`}
                        >
                            <HardHat className={`w-6 h-6 ${selectedRole === 'provider' ? 'text-primary' : 'text-slate-400'}`} />

                            <span className={`text-sm font-semibold ${selectedRole === 'provider' ? 'text-primary' : 'text-slate-600 dark:text-gray-400'}`}>
                                Provider
                            </span>
                            <span className="text-xs text-slate-400 dark:text-gray-500">I offer services</span>
                        </button>
                    </div>
                    {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
                </div>

                {/* First Name */}
                <div className="space-y-1.5">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 dark:text-gray-300">First Name</label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="firstName"
                            {...register('firstName')}
                            placeholder="John"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        />
                    </div>
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Last Name</label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="lastName"
                            {...register('lastName')}
                            placeholder="Doe"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        />
                    </div>
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
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

                {/* Phone */}
                <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            id="phone"
                            type="tel"
                            {...register('phone')}
                            placeholder="+1234567890"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
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