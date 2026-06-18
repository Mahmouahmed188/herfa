'use client';

import * as React from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from '@/features/addresses/hooks/useAddresses';
import { useAddressForm } from '@/features/addresses/hooks/useAddressForm';
import { AddressList } from '@/features/addresses/components/AddressList';
import { AddressForm } from '@/features/addresses/components/AddressForm';
import { Address } from '@/features/addresses/types';
import { AddressFormData } from '@/features/addresses/schemas/validation';

export default function AddressesPage() {
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);

  const { data, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const rawData = data as { data?: Address[] } | Address[] | undefined;
  const addresses = Array.isArray(rawData) ? rawData : rawData?.data ?? [];

  const createForm = useAddressForm();
  const editForm = useAddressForm(editingAddress ?? undefined);

  const handleCreate = (formData: AddressFormData) => {
    createAddress.mutate(formData as unknown as Parameters<typeof createAddress.mutate>[0], {
      onSuccess: () => {
        setIsAdding(false);
        createForm.reset();
      },
    });
  };

  const handleUpdate = (formData: AddressFormData) => {
    if (!editingAddress) return;
    updateAddress.mutate(
      { id: editingAddress.id, data: formData as unknown as Parameters<typeof updateAddress.mutate>[0]['data'] },
      {
        onSuccess: () => {
          setEditingAddress(null);
          editForm.reset();
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteAddress.mutate(id);
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress.mutate(id);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Addresses</h1>
        </div>
        {!isAdding && !editingAddress && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Address
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">New Address</h2>
          <AddressForm
            form={createForm}
            onSubmit={handleCreate}
            isPending={createAddress.isPending}
            submitLabel="Save Address"
          />
          <button
            onClick={() => {
              setIsAdding(false);
              createForm.reset();
            }}
            className="mt-3 text-sm text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
      )}

      {editingAddress && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Edit Address</h2>
          <AddressForm
            form={editForm}
            onSubmit={handleUpdate}
            isPending={updateAddress.isPending}
            submitLabel="Update Address"
          />
          <button
            onClick={() => {
              setEditingAddress(null);
              editForm.reset();
            }}
            className="mt-3 text-sm text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
      )}

      {!isAdding && !editingAddress && (
        <AddressList
          addresses={addresses}
          isLoading={isLoading}
          onEdit={setEditingAddress}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />
      )}
    </div>
  );
}
