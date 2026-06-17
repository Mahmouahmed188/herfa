'use client';

import { User } from '@/types/api';

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            (user.firstName?.charAt(0) || 'U').toUpperCase()
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Email
          </label>
          <p className="text-sm text-slate-900 dark:text-white">{user.email}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Phone
          </label>
          <p className="text-sm text-slate-900 dark:text-white">{user.phone || '—'}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Status
          </label>
          <p className="text-sm text-slate-900 dark:text-white">{user.status}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Member Since
          </label>
          <p className="text-sm text-slate-900 dark:text-white">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
