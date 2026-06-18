import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export function ProfileSummary() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border-2 border-primary/20"
        style={{
          backgroundImage: user.avatarUrl
            ? `url("${user.avatarUrl}")`
            : undefined,
        }}
      >
        {!user.avatarUrl && (
          <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-slate-400 dark:text-gray-500 truncate">
          {user.email}
        </p>
      </div>
    </div>
  );
}
