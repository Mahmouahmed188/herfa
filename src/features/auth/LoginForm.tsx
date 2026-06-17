'use client';

import * as React from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Link } from '@/lib/navigation';
import { useAuthStore } from './stores/useAuthStore';
import { login as apiLogin } from '@/services/api';
import { loginSchema, LoginValues } from './schemas/validation';
import { getDashboardRoute } from './services/redirect';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    setError('');

    try {
      const result = await apiLogin(data);

      if (result?.accessToken) {
        const storeUser = {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName || result.user.email.split('@')[0],
          lastName: result.user.lastName || '',
          role: result.user.role,
          avatarUrl: result.user.avatarUrl,
          status: result.user.status || 'ACTIVE',
          createdAt: result.user.createdAt || new Date().toISOString(),
          updatedAt: result.user.updatedAt || new Date().toISOString(),
        };

        login(storeUser, result.accessToken);

        const dashboardRoute = getDashboardRoute(storeUser.role);
        router.push(dashboardRoute);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Connection error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm">
          Log in to connect with skilled craftsmen
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700 dark:text-gray-300"
            >
              Password
            </label>
            <Link href="/" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
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
          className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-surface-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-background-light dark:bg-background-dark text-slate-500 dark:text-gray-500">
            New to Herfa?
          </span>
        </div>
      </div>

      {/* Register Link */}
      <Link
        href="/register"
        className="w-full flex items-center justify-center py-3 px-6 rounded-xl border border-slate-200 dark:border-surface-border text-slate-700 dark:text-gray-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-surface-dark transition-all"
      >
        Create an Account
      </Link>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 dark:text-gray-600 mt-6">
        © 2026 Herfa Inc. &nbsp;·&nbsp;{' '}
        <Link href="/" className="hover:underline">
          Privacy
        </Link>
        &nbsp;·&nbsp;
        <Link href="/" className="hover:underline">
          Terms
        </Link>
      </p>
    </div>
  );
}
