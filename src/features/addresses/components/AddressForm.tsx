import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { AddressFormData } from '../schemas/validation';

interface AddressFormProps {
  form: UseFormReturn<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  isPending: boolean;
  submitLabel: string;
}

export function AddressForm({ form, onSubmit, isPending, submitLabel }: AddressFormProps) {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" placeholder="e.g. Home, Work" {...register('label')} />
        {errors.label && <p className="text-sm text-destructive">{errors.label.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Street</Label>
        <Input id="street" placeholder="Street name and number" {...register('street')} />
        {errors.street && <p className="text-sm text-destructive">{errors.street.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="building">Building / Apartment</Label>
          <Input id="building" placeholder="Optional" {...register('building')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="05xxxxxxxx" {...register('phone')} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="e.g. Riyadh" {...register('city')} />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Area</Label>
          <Input id="area" placeholder="e.g. Al-Olaya" {...register('area')} />
          {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInstructions">Additional Instructions</Label>
        <textarea
          id="additionalInstructions"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px]"
          placeholder="Any special instructions for the technician"
          {...register('additionalInstructions')}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          className="rounded border-slate-300 dark:border-surface-border"
          {...register('isDefault')}
        />
        <Label htmlFor="isDefault">Set as default address</Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
