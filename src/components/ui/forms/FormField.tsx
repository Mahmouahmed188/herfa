'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  children: React.ReactElement;
  className?: string;
}

/**
 * FormField is a wrapper for form inputs that handles error messages and labels.
 * It expects to be used within a FormProvider from react-hook-form.
 */
export function FormField({
  name,
  label,
  description,
  children,
  className,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className={cn(error && 'text-destructive')}>
          {label}
        </Label>
      )}
      {React.cloneElement(children, {
        ...register(name),
        id: name,
        className: cn(children.props.className, error && 'border-destructive focus-visible:ring-destructive'),
      })}
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm font-medium text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
