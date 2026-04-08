import type { ComponentProps } from 'react';
import { ControlWrapper, FormField } from '../../ui/forms/form';
import type { Input } from '../../ui/forms/input';
import { useFormContext } from 'react-hook-form';

import { DebounceInput } from './debounce-input';

export interface FormDebounceInputProps extends Omit<ComponentProps<typeof Input>, 'onChange'> {
  name: string;
  label?: string;
  required?: boolean;
  debounceMs?: number;
  onChange?: (value: string) => void;
}

export const FormDebounceInput = ({
  name,
  label,
  required,
  debounceMs = 500,
  onChange,
  ...inputProps
}: FormDebounceInputProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <ControlWrapper label={label} required={required}>
          <DebounceInput
            {...inputProps}
            value={field.value ?? ''}
            onChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            onBlur={field.onBlur}
            debounceMs={debounceMs}
          />
        </ControlWrapper>
      )}
    />
  );
};
