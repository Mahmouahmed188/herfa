import { Loader2, MapPin } from 'lucide-react';
import { AddressCard } from './AddressCard';
import { Address } from '../types';
import { Card, CardContent } from '@/components/ui/card';

interface AddressListProps {
  addresses: Address[];
  isLoading: boolean;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressList({ addresses, isLoading, onEdit, onDelete, onSetDefault }: AddressListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">No addresses saved yet</h2>
          <p className="text-muted-foreground">Add your first address to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
}
