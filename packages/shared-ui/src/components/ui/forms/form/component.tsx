'use client';

import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form';
import { Label } from '../../display/label';
import { cn } from '../../../../lib/utils';

/**
 * Form Component - Hybrid approach with Base UI readiness
 *
 * Migration Strategy:
 * - Keeps react-hook-form Controller pattern (user preference)
 * - Maintains existing FormField/FormLabel/FormControl/FormMessage structure
 * - Uses Slot for FormControl composition (maintains backward compatibility)
 * - Ready for Base UI Field integration when needed
 *
 * Base UI Migration Path (Future Phase 4):
 * - FormField → Keep Controller wrapper
 * - FormLabel → Could migrate to Field.Label
 * - FormControl → Could migrate to Field.Control
 * - FormMessage → Could migrate to Field.Error
 *
 * Current Status: Compatible with Base UI Input (migrated in Phase 3a)
 * - FormControl's aria-invalid and aria-describedby work with Base UI Input
 * - Base UI Input's data attributes (data-valid, data-invalid) complement FormField state
 */
const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(function FormItem(
  { className, ...props },
  ref
) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} data-slot="form-item" className={cn('grid gap-1.5', className)} {...props} />
    </FormItemContext.Provider>
  );
});

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-[0.625rem] text-muted-foreground', className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-xs', className)}
      {...props}
    >
      {body}
    </p>
  );
}

type ControlWrapperProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
  required?: boolean;
  layout?: 'vertical' | 'horizontal' | 'horizontal-reverse';
  description?: React.ReactNode;
};

const ControlWrapper = React.forwardRef<HTMLDivElement, ControlWrapperProps>(
  function ControlWrapper(
    { label, className, children, required, layout = 'vertical', description },
    ref
  ) {
    if (layout === 'horizontal' || layout === 'horizontal-reverse') {
      return (
        <FormItem ref={ref} className={cn('grid gap-1.5', className)}>
          <div
            className={cn(
              'flex items-center gap-4',
              layout === 'horizontal-reverse' && 'flex-row-reverse justify-end'
            )}
          >
            {label && (
              <div className="flex min-w-30 items-center gap-2">
                <FormLabel required={required}>{label}</FormLabel>
              </div>
            )}
            <FormControl>{children}</FormControl>
          </div>
          <FormMessage />
        </FormItem>
      );
    }

    return (
      <FormItem ref={ref} className={className}>
        {label && <FormLabel required={required}>{label}</FormLabel>}
        {description && <FormDescription>{description}</FormDescription>}
        <FormControl>{children}</FormControl>
        <FormMessage />
      </FormItem>
    );
  }
);

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  ControlWrapper,
};
