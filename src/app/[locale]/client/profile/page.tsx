'use client';

import * as React from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { ProfileView } from '@/features/auth/components/ProfileView';
import { ProfileForm } from '@/features/auth/components/ProfileForm';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ClientProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      <ClientProfileContent />
    </ProtectedRoute>
  );
}

function ClientProfileContent() {
    const { user } = useAuthStore();
    const { data: profileData, isLoading } = useProfile();
    const [isEditing, setIsEditing] = React.useState(false);

    const currentProfile = profileData || user;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all"
                >
                    {isEditing ? 'View Profile' : 'Edit Profile'}
                </button>
            </div>

            {isEditing ? (
                <ProfileForm />
            ) : (
                currentProfile && <ProfileView user={currentProfile} />
            )}
        </div>
    );
}
