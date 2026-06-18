import { Megaphone, Calendar } from 'lucide-react';

interface AnnouncementCardProps {
  id: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
}

export function AnnouncementCard({ title, body, status, createdAt }: AnnouncementCardProps) {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5 text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
            {status === 'SENT' && (
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-2 line-clamp-3">{body}</p>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400 dark:text-gray-500">
            <Calendar className="w-3 h-3" />
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}