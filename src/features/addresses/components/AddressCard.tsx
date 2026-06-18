import { MapPin, Star, Pencil, Trash2 } from 'lucide-react';
import { Address } from '../types';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className="relative p-4 rounded-xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900 dark:text-white">{address.label}</p>
              {address.isDefault && (
                <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" /> Default
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">
              {address.street}{address.building ? `, ${address.building}` : ''}
            </p>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {address.area}, {address.city}
            </p>
            {address.phone && (
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">{address.phone}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(address)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-400 hover:text-primary transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!address.isDefault && (
        <button
          onClick={() => onSetDefault(address.id)}
          className="mt-3 text-xs font-semibold text-primary hover:underline"
        >
          Set as default
        </button>
      )}
    </div>
  );
}
