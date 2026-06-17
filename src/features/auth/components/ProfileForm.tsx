'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../stores/useAuthStore';
import { useUpdateProfile, useUploadAvatar } from '../hooks/useProfile';
import { updateProfileSchema, UpdateProfileValues } from '../schemas/validation';
import { Loader2 } from 'lucide-react';

export function ProfileForm() {
  const { user, updateUser } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const [successMessage, setSuccessMessage] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  const onSubmit = async (data: UpdateProfileValues) => {
    setSuccessMessage('');
    try {
      const result = await updateProfileMutation.mutateAsync(data);
      updateUser(result);
      setSuccessMessage('Profile updated successfully');
    } catch {
      // Error handled by form
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadAvatarMutation.mutateAsync(file);
      const avatarUrl = result.url;
      await updateProfileMutation.mutateAsync({ avatarUrl });
      updateUser({ avatarUrl });
      setSuccessMessage('Avatar updated successfully');
    } catch {
      // Error handled
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {successMessage && (
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 text-sm text-green-600 dark:text-green-400">
          {successMessage}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Avatar</label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user?.firstName?.charAt(0) || 'U').toUpperCase()
            )}
          </div>
          <label className="cursor-pointer px-4 py-2 rounded-xl border border-slate-200 dark:border-surface-border text-sm font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-surface-dark transition-all">
            Upload Avatar
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">First Name</label>
          <input
            {...register('firstName')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Last Name</label>
          <input
            {...register('lastName')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">Phone</label>
          <input
            {...register('phone')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={updateProfileMutation.isPending}
        className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all disabled:opacity-70 flex items-center gap-2"
      >
        {updateProfileMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  );
}
