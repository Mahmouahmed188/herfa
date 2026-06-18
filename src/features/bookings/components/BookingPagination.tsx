import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BookingPagination({ page, totalPages, onPageChange }: BookingPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-surface-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .map((p, idx, arr) => (
          <span key={p} className="flex items-center gap-1">
            {idx > 0 && arr[idx - 1] !== p - 1 && (
              <span className="px-1 text-slate-400 dark:text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`min-w-[36px] h-9 rounded-lg text-sm font-semibold transition-colors ${
                p === page
                  ? 'bg-primary text-white'
                  : 'border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-surface-border'
              }`}
            >
              {p}
            </button>
          </span>
        ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-surface-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
