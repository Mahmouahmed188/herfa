import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressFormData } from '../schemas/validation';
import { Address } from '../types';

export function useAddressForm(existingAddress?: Address) {
  return useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: existingAddress
      ? {
          label: existingAddress.label,
          street: existingAddress.street,
          building: existingAddress.building || '',
          city: existingAddress.city,
          area: existingAddress.area,
          latitude: existingAddress.latitude,
          longitude: existingAddress.longitude,
          isDefault: existingAddress.isDefault,
          phone: existingAddress.phone || '',
          additionalInstructions: existingAddress.additionalInstructions || '',
        }
      : {
          label: '',
          street: '',
          building: '',
          city: '',
          area: '',
          isDefault: false,
          phone: '',
          additionalInstructions: '',
        },
  });
}
