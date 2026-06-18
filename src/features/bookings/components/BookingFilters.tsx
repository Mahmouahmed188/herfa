import { BookingStatus } from '../types';

interface BookingFiltersProps {
  status: BookingStatus | 'ALL';
  sort: 'newest' | 'oldest';
  onStatusChange: (status: BookingStatus | 'ALL') => void;
  onSortChange: (sort: 'newest' | 'oldest') => void;
}

const statusOptions: { value: BookingStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function BookingFilters({ status, sort, onStatusChange, onSortChange }: BookingFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              status === option.value
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-surface-dark text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-surface-border'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest')}
        className="ml-auto px-3 py-1.5 rounded-lg border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark text-sm text-slate-700 dark:text-gray-300"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
}
